import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { MAX_AVATAR_FILE_SIZE, type UploadedAvatarFile } from "./avatar-file";
import { UploadAvatarResponseDto } from "./dto";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { UploadService } from "./upload.service";

@ApiTags("upload")
@Controller("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post("avatar")
	@UseInterceptors(
		FileInterceptor("file", {
			limits: { fileSize: MAX_AVATAR_FILE_SIZE, files: 1 },
		}),
	)
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
		@Session() session: UserSession,
		@UploadedFile() file: UploadedAvatarFile | undefined,
	): Promise<UploadAvatarResponseDto> {
		return this.uploadService.uploadAvatar(session.user, file);
	}
}
