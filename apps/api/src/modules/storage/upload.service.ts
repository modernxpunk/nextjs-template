import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { authSchema, eq } from "@repo/db";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { DatabaseService } from "../../database/database.service";
import { type UploadedAvatarFile, validateAvatarFile } from "./avatar-file";
import type { UploadAvatarResponseDto } from "./dto/upload-avatar-response.dto";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { StorageService } from "./storage.service";

@Injectable()
export class UploadService {
	private readonly logger = new Logger(UploadService.name);

	constructor(
		private readonly storageService: StorageService,
		private readonly databaseService: DatabaseService,
	) {}

	async uploadAvatar(
		user: { id: string; image?: string | null },
		file: UploadedAvatarFile | undefined,
	): Promise<UploadAvatarResponseDto> {
		if (!file) {
			throw new BadRequestException("No file provided");
		}
		const fileFormat = validateAvatarFile(file);

		const imageUrl = await this.storageService.uploadFile(
			file.buffer,
			fileFormat,
			"avatars",
		);

		try {
			await this.updateUserAvatar(user.id, imageUrl);
		} catch (error) {
			await this.deleteAvatar(imageUrl, "new");
			throw error;
		}

		await this.deleteAvatar(user.image, "old");

		return { success: true, imageUrl };
	}

	private async deleteAvatar(
		avatarUrl: string | null | undefined,
		label: "new" | "old",
	): Promise<void> {
		if (!avatarUrl) return;

		try {
			await this.storageService.deleteFile(avatarUrl, "avatars/");
		} catch (error) {
			this.logger.warn(`Failed to delete ${label} avatar`, error);
		}
	}

	private async updateUserAvatar(
		userId: string,
		imageUrl: string,
	): Promise<void> {
		const [updatedUser] = await this.databaseService.db
			.update(authSchema.user)
			.set({ image: imageUrl, updatedAt: new Date() })
			.where(eq(authSchema.user.id, userId))
			.returning({ id: authSchema.user.id });

		if (!updatedUser) {
			throw new InternalServerErrorException("Unable to update user avatar");
		}
	}
}
