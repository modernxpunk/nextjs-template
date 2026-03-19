const env = process.env.NODE_ENV ?? "development";
const logLevel = process.env.LOG_LEVEL ?? "info";
const lokiHost = process.env.LOKI_URL;
const serviceName = process.env.LOKI_APP_NAME ?? "api";

const targets: Array<{
	target: string;
	level?: string;
	options?: Record<string, unknown>;
}> = [];

if (lokiHost) {
	targets.push({
		target: "pino-loki",
		level: logLevel,
		options: {
			host: lokiHost,
			labels: {
				app: serviceName,
				env,
			},
			batching: {
				interval: 5,
				maxBufferSize: 10_000,
			},
			replaceTimestamp: true,
		},
	});
}

if (env !== "production") {
	targets.push({
		target: "pino-pretty",
		options: {
			colorize: true,
			singleLine: true,
			translateTime: "SYS:standard",
		},
	});
}

export const pinoHttpConfig = {
	level: logLevel,
	...(targets.length > 0
		? {
				transport: {
					targets,
				},
			}
		: {}),
	customProps: () => ({
		service: serviceName,
		env,
	}),
	redact: {
		paths: [
			"req.headers.authorization",
			"req.headers.cookie",
			"res.headers['set-cookie']",
		],
		censor: "[Redacted]",
	},
};
