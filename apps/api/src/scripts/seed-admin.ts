import { closeDbConnection } from "@repo/db";
import { APIError } from "better-auth";
import { auth } from "../modules/auth/auth";

const enabled = (process.env.SAMPLE_ADMIN_ENABLED ?? "true").toLowerCase();
const sampleAdminEnabled = !["0", "false", "no"].includes(enabled);

const sampleAdminName = process.env.SAMPLE_ADMIN_NAME?.trim() || "Sample Admin";
const sampleAdminEmail =
	process.env.SAMPLE_ADMIN_EMAIL?.trim().toLowerCase() || "admin@example.com";
const sampleAdminPassword = process.env.SAMPLE_ADMIN_PASSWORD?.trim();

async function seedSampleAdmin(): Promise<void> {
	if (!sampleAdminEnabled) {
		console.log(
			"Sample admin seed skipped because SAMPLE_ADMIN_ENABLED=false.",
		);
		return;
	}

	if (!sampleAdminPassword) {
		throw new Error(
			"SAMPLE_ADMIN_PASSWORD is required to seed the sample admin user.",
		);
	}

	if (sampleAdminPassword.length < 8) {
		throw new Error(
			"SAMPLE_ADMIN_PASSWORD must contain at least 8 characters.",
		);
	}

	try {
		await auth.api.createUser({
			body: {
				name: sampleAdminName,
				email: sampleAdminEmail,
				password: sampleAdminPassword,
				role: "admin",
			},
		});
	} catch (error: unknown) {
		if (
			!(error instanceof APIError) ||
			error.body?.code !== "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
		) {
			throw error;
		}
	}

	console.log(`Sample admin ready: ${sampleAdminEmail} (admin)`);
}

seedSampleAdmin()
	.finally(async () => {
		await closeDbConnection();
	})
	.catch((error: unknown) => {
		console.error(error);
		process.exitCode = 1;
	});
