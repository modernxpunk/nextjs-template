import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

class HealthResponseDto {
	@ApiProperty({ example: "ok" })
	status: "ok";
}

@ApiTags("health")
@Controller("health")
export class HealthController {
	@AllowAnonymous()
	@Get()
	@ApiOperation({ summary: "Health check endpoint" })
	@ApiOkResponse({
		description: "Service is healthy.",
		type: HealthResponseDto,
	})
	getHealth(): HealthResponseDto {
		return { status: "ok" };
	}
}
