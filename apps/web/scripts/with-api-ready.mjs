import { spawn } from "node:child_process";

const parsePositiveDuration = (value, fallback, name) => {
	const duration = Number(value ?? fallback);
	if (!Number.isFinite(duration) || duration <= 0) {
		throw new Error(`${name} must be a positive number`);
	}
	return duration;
};

const API_BASE_URL =
	process.env.API_URL ??
	process.env.NEXT_PUBLIC_API_URL ??
	"http://localhost:4000";
const HEALTHCHECK_URL = `${API_BASE_URL.replace(/\/+$/, "")}/health`;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = parsePositiveDuration(
	process.env.API_REQUEST_TIMEOUT_MS,
	5000,
	"API_REQUEST_TIMEOUT_MS",
);
const STARTUP_TIMEOUT_MS = parsePositiveDuration(
	process.env.API_STARTUP_TIMEOUT_MS,
	120_000,
	"API_STARTUP_TIMEOUT_MS",
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForApi = async () => {
	const startedAt = Date.now();
	let lastFailure;
	while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
		try {
			const response = await fetch(HEALTHCHECK_URL, {
				method: "GET",
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			});
			if (response.ok) {
				return;
			}
			lastFailure = new Error(
				`API health check returned HTTP ${response.status}`,
			);
		} catch (error) {
			lastFailure = error;
		}

		console.log(`Waiting for API at ${HEALTHCHECK_URL}...`);
		await sleep(RETRY_DELAY_MS);
	}

	throw new Error(
		`API did not become ready within ${STARTUP_TIMEOUT_MS}ms (${HEALTHCHECK_URL})`,
		{ cause: lastFailure },
	);
};

const run = async () => {
	const command = process.argv[2];
	const args = process.argv.slice(3);

	if (!command) {
		throw new Error("No command passed to with-api-ready script");
	}

	await waitForApi();
	console.log(`API is ready (${HEALTHCHECK_URL}). Starting ${command}...`);

	const child = spawn(command, args, { stdio: "inherit" });
	const forwardSignal = (signal) => {
		if (!child.killed) child.kill(signal);
	};
	process.once("SIGINT", () => forwardSignal("SIGINT"));
	process.once("SIGTERM", () => forwardSignal("SIGTERM"));
	child.on("error", (error) => {
		console.error(`Failed to start ${command}:`, error);
		process.exitCode = 1;
	});
	child.on("exit", (code, signal) => {
		if (signal) {
			process.removeAllListeners(signal);
			process.kill(process.pid, signal);
			return;
		}
		process.exitCode = code ?? 1;
	});
};

void run().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
