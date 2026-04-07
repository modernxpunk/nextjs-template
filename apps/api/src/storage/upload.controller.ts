import { Controller, Post, Req } from "@nestjs/common";
import {
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UploadAvatarResponseDto } from "./dto";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { UploadService } from "./upload.service";

interface ExpressRequest {
	headers: Record<string, string | string[] | undefined>;
	on(event: "data", listener: (chunk: Buffer) => void): this;
	on(event: "end", listener: () => void): this;
	on(event: "error", listener: (err: Error) => void): this;
}

@ApiTags("upload")
@Controller("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

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
	@ApiOkResponse({
		description: "Avatar uploaded successfully.",
		type: UploadAvatarResponseDto,
	})
	@ApiUnauthorizedResponse({ description: "Not authenticated" })
	async uploadAvatar(
		@Req() req: ExpressRequest,
	): Promise<UploadAvatarResponseDto> {
		return this.uploadService.uploadAvatar(req);
	}
}
