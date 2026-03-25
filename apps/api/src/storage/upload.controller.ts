import {
	BadRequestException,
	Controller,
	Post,
	Req,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { authSchema, db, eq } from "@repo/db";
import { auth } from "../auth/auth";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { StorageService } from "./storage.service";

interface ExpressRequest {
	headers: Record<string, string | string[] | undefined>;
	on(event: "data", listener: (chunk: Buffer) => void): this;
	on(event: "end", listener: () => void): this;
	on(event: "error", listener: (err: Error) => void): this;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
	constructor(private readonly storageService: StorageService) {}

	@Post("avatar")
	@ApiOperation({ summary: "Upload user avatar" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	async uploadAvatar(@Req() req: ExpressRequest) {
		const session = await auth.api.getSession({
			headers: req.headers as Record<string, string>,
		});
		if (!session?.user) {
			throw new UnauthorizedException("Not authenticated");
		}

		const chunks: Buffer[] = [];
		let totalSize = 0;
		const contentType = (req.headers["content-type"] as string) || "";
		let boundary = "";
		let filename = "avatar.jpg";

		// Extract boundary from content-type
		const boundaryMatch = contentType.match(/boundary=(.+)/);
		if (boundaryMatch?.[1]) {
			boundary = boundaryMatch[1];
		}

		// Collect all chunks
		await new Promise<void>((resolve, reject) => {
			req.on("data", (chunk: Buffer) => {
				totalSize += chunk.length;
				if (totalSize > MAX_FILE_SIZE) {
					reject(new BadRequestException("File too large (max 5MB)"));
					return;
				}
				chunks.push(chunk);
			});
			req.on("end", resolve);
			req.on("error", reject);
		});

		const body = Buffer.concat(chunks);

		// Parse multipart form data manually
		const bodyStr = body.toString("binary");
		const parts = bodyStr.split(`--${boundary}`);

		let fileBuffer: Buffer | null = null;
		let fileContentType = "";

		for (const part of parts) {
			if (part.includes("Content-Disposition")) {
				const headerEnd = part.indexOf("\r\n\r\n");
				if (headerEnd === -1) continue;

				const headers = part.substring(0, headerEnd);
				const content = part.substring(headerEnd + 4);

				// Extract filename
				const filenameMatch = headers.match(/filename="([^"]+)"/);
				if (filenameMatch?.[1]) {
					filename = filenameMatch[1];
				}

				// Extract content type
				const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
				if (typeMatch?.[1]) {
					fileContentType = typeMatch[1].trim();
				}

				// Remove trailing boundary markers
				let cleanContent = content;
				if (cleanContent.endsWith("--\r\n")) {
					cleanContent = cleanContent.slice(0, -4);
				}
				if (cleanContent.endsWith("\r\n")) {
					cleanContent = cleanContent.slice(0, -2);
				}

				fileBuffer = Buffer.from(cleanContent, "binary");
			}
		}

		if (!fileBuffer || fileBuffer.length === 0) {
			throw new BadRequestException("No file provided");
		}

		if (!ALLOWED_TYPES.includes(fileContentType)) {
			throw new BadRequestException(
				"Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
			);
		}

		// Delete old avatar if exists
		if (session.user.image) {
			try {
				await this.storageService.deleteFile(session.user.image);
			} catch {
				// Ignore errors when deleting old avatar
			}
		}

		// Upload new avatar
		const imageUrl = await this.storageService.uploadFile(
			fileBuffer,
			filename,
			"avatars",
		);

		// Update user in database
		await db
			.update(authSchema.user)
			.set({ image: imageUrl, updatedAt: new Date() })
			.where(eq(authSchema.user.id, session.user.id));

		return {
			success: true,
			imageUrl,
		};
	}
}
