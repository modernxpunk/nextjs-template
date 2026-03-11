import { spawn } from "node:child_process";

const API_BASE_URL =
	process.env.API_URL ?? process.env.PUBLIC_API_URL ?? "http://localhost:4000";
const HEALTHCHECK_URL = `${API_BASE_URL.replace(/\/$/, "")}/health`;
const RETRY_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForApi = async () => {
	for (;;) {
		try {
			const response = await fetch(HEALTHCHECK_URL, { method: "GET" });
			if (response.ok) {
				return;
			}
		} catch {}

		console.log(`Waiting for API at ${HEALTHCHECK_URL}...`);
		await sleep(RETRY_DELAY_MS);
	}
};

const run = async () => {
	const command = process.argv[2];
	const args = process.argv.slice(3);

	if (!command) {
		console.error("No command passed to with-api-ready script");
		process.exit(1);
	}

	await waitForApi();
	console.log(`API is ready (${HEALTHCHECK_URL}). Starting ${command}...`);

	const child = spawn(command, args, { stdio: "inherit" });
	child.on("exit", (code) => {
		process.exit(code ?? 0);
	});
};

void run();
