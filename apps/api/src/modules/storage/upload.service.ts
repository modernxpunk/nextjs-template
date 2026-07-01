import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { authSchema, eq } from "@repo/db";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { DatabaseService } from "../../database/database.service";
import { auth } from "../auth/auth";
import type { UploadAvatarResponseDto } from "./dto/upload-avatar-response.dto";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { StorageService } from "./storage.service";

interface ExpressRequest {
	headers: Record<string, string | string[] | undefined>;
	on(event: "data", listener: (chunk: Buffer) => void): this;
	on(event: "end", listener: () => void): this;
	on(event: "error", listener: (err: Error) => void): this;
}

interface ParsedFile {
	buffer: Buffer;
	filename: string;
	contentType: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

@Injectable()
export class UploadService {
	private readonly logger = new Logger(UploadService.name);

	constructor(
		private readonly storageService: StorageService,
		private readonly databaseService: DatabaseService,
	) {}

	async uploadAvatar(req: ExpressRequest): Promise<UploadAvatarResponseDto> {
		const session = await this.getSession(req);
		const parsedFile = await this.parseMultipartRequest(req);

		this.validateFile(parsedFile);

		await this.deleteOldAvatar(session.user.image);

		const imageUrl = await this.storageService.uploadFile(
			parsedFile.buffer,
			parsedFile.filename,
			"avatars",
		);

		await this.updateUserAvatar(session.user.id, imageUrl);

		return { success: true, imageUrl };
	}

	private async getSession(req: ExpressRequest) {
		const session = await auth.api.getSession({
			headers: req.headers as Record<string, string>,
		});

		if (!session?.user) {
			throw new UnauthorizedException("Not authenticated");
		}

		return session;
	}

	private async parseMultipartRequest(
		req: ExpressRequest,
	): Promise<ParsedFile> {
		const contentType = (req.headers["content-type"] as string) || "";
		const boundary = this.extractBoundary(contentType);

		const body = await this.collectRequestBody(req);
		return this.parseMultipartBody(body, boundary);
	}

	private extractBoundary(contentType: string): string {
		const boundaryMatch = contentType.match(/boundary=(.+)/);
		return boundaryMatch?.[1] || "";
	}

	private async collectRequestBody(req: ExpressRequest): Promise<Buffer> {
		const chunks: Buffer[] = [];
		let totalSize = 0;

		return new Promise<Buffer>((resolve, reject) => {
			req.on("data", (chunk: Buffer) => {
				totalSize += chunk.length;
				if (totalSize > MAX_FILE_SIZE) {
					reject(new BadRequestException("File too large (max 5MB)"));
					return;
				}
				chunks.push(chunk);
			});
			req.on("end", () => resolve(Buffer.concat(chunks)));
			req.on("error", reject);
		});
	}

	private parseMultipartBody(body: Buffer, boundary: string): ParsedFile {
		const bodyStr = body.toString("binary");
		const parts = bodyStr.split(`--${boundary}`);

		let fileBuffer: Buffer | null = null;
		let fileContentType = "";
		let filename = "avatar.jpg";

		for (const part of parts) {
			if (!part.includes("Content-Disposition")) continue;

			const headerEnd = part.indexOf("\r\n\r\n");
			if (headerEnd === -1) continue;

			const headers = part.substring(0, headerEnd);
			const content = part.substring(headerEnd + 4);

			const filenameMatch = headers.match(/filename="([^"]+)"/);
			if (filenameMatch?.[1]) {
				filename = filenameMatch[1];
			}

			const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
			if (typeMatch?.[1]) {
				fileContentType = typeMatch[1].trim();
			}

			let cleanContent = content;
			if (cleanContent.endsWith("--\r\n")) {
				cleanContent = cleanContent.slice(0, -4);
			}
			if (cleanContent.endsWith("\r\n")) {
				cleanContent = cleanContent.slice(0, -2);
			}

			fileBuffer = Buffer.from(cleanContent, "binary");
		}

		if (!fileBuffer || fileBuffer.length === 0) {
			throw new BadRequestException("No file provided");
		}

		return { buffer: fileBuffer, filename, contentType: fileContentType };
	}

	private validateFile(file: ParsedFile): void {
		if (!ALLOWED_TYPES.includes(file.contentType)) {
			throw new BadRequestException(
				"Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
			);
		}
	}

	private async deleteOldAvatar(
		avatarUrl: string | null | undefined,
	): Promise<void> {
		if (!avatarUrl) return;

		try {
			await this.storageService.deleteFile(avatarUrl);
		} catch (error) {
			this.logger.warn("Failed to delete old avatar:", error);
		}
	}

	private async updateUserAvatar(
		userId: string,
		imageUrl: string,
	): Promise<void> {
		await this.databaseService.db
			.update(authSchema.user)
			.set({ image: imageUrl, updatedAt: new Date() })
			.where(eq(authSchema.user.id, userId));
	}
}
