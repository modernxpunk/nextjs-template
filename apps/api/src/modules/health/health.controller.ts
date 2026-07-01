import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { HealthResponseDto } from "./dto/health-response.dto";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@AllowAnonymous()
	@Get()
	@ApiOperation({ summary: "Health check endpoint" })
	@ApiOkResponse({
		description: "Service is healthy.",
		type: HealthResponseDto,
	})
	getHealth(): HealthResponseDto {
		return this.healthService.getHealth();
	}
}
