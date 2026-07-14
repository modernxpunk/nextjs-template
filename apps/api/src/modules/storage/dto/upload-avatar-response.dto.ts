import { ApiProperty } from "@nestjs/swagger";

export class UploadAvatarResponseDto {
	@ApiProperty({
		example: true,
		description: "Whether the upload was successful",
	})
	success: boolean;

	@ApiProperty({
		example: "https://s3.example.com/uploads/avatars/abc123.jpg",
		description: "URL of the uploaded avatar image",
	})
	imageUrl: string;
}
