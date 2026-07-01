import { ApiProperty } from "@nestjs/swagger";

export class HealthResponseDto {
	@ApiProperty({ example: "ok", description: "Health status of the service" })
	status: "ok";
}
