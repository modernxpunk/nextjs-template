import { Controller, Get } from "@nestjs/common";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

type HealthResponse = {
	status: "ok";
};

@Controller("health")
export class HealthController {
	@AllowAnonymous()
	@Get()
	getHealth(): HealthResponse {
		return { status: "ok" };
	}
}
