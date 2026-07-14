import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";

type LogLevel = "log" | "error" | "warn" | "debug" | "verbose" | "fatal";

const LOG_LEVEL_HIERARCHY: LogLevel[] = [
	"verbose",
	"debug",
	"log",
	"warn",
	"error",
	"fatal",
];

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
	trace: "verbose",
	verbose: "verbose",
	debug: "debug",
	info: "log",
	log: "log",
	warn: "warn",
	warning: "warn",
	error: "error",
	fatal: "fatal",
};

function serializeLogValue(value: unknown): string {
	const seen = new WeakSet<object>();
	try {
		const serialized = JSON.stringify(value, (_key, item: unknown) => {
			if (typeof item === "bigint") return item.toString();
			if (typeof item === "object" && item !== null) {
				if (seen.has(item)) return "[Circular]";
				seen.add(item);
			}
			if (item instanceof Error) {
				return {
					name: item.name,
					message: item.message,
					stack: item.stack,
					cause: item.cause,
				};
			}
			return item;
		});

		return serialized ?? String(value);
	} catch {
		try {
			return String(value);
		} catch {
			return "[Unserializable]";
		}
	}
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
	private readonly isJson: boolean;
	private readonly enabledLevels: Set<LogLevel>;
	private readonly serviceName: string;
	private readonly env: string;

	constructor() {
		super();

		this.env = process.env.NODE_ENV ?? "development";
		this.serviceName = process.env.APP_NAME ?? "api";
		this.isJson =
			process.env.LOG_FORMAT === "json" || this.env === "production";

		const configuredLevel = process.env.LOG_LEVEL ?? "info";
		this.enabledLevels = this.buildEnabledLevels(configuredLevel);
	}

	private buildEnabledLevels(level: string): Set<LogLevel> {
		const mappedLevel = LOG_LEVEL_MAP[level.toLowerCase()] ?? "log";
		const startIndex = LOG_LEVEL_HIERARCHY.indexOf(mappedLevel);
		return new Set(LOG_LEVEL_HIERARCHY.slice(startIndex));
	}

	private shouldLog(level: LogLevel): boolean {
		return this.enabledLevels.has(level);
	}

	private formatJsonLog(
		level: LogLevel,
		message: unknown,
		context?: string,
		trace?: string,
	): string {
		const logObject: Record<string, unknown> = {
			level,
			timestamp: new Date().toISOString(),
			service: this.serviceName,
			env: this.env,
			context: context ?? this.context,
			message:
				typeof message === "string" ? message : serializeLogValue(message),
		};

		if (trace) {
			logObject.trace = trace;
		}

		return JSON.stringify(logObject);
	}

	log(message: unknown, context?: string): void {
		if (!this.shouldLog("log")) return;

		if (this.isJson) {
			console.log(this.formatJsonLog("log", message, context));
		} else {
			super.log(message, context);
		}
	}

	error(message: unknown, trace?: string, context?: string): void {
		if (!this.shouldLog("error")) return;

		if (this.isJson) {
			console.error(this.formatJsonLog("error", message, context, trace));
		} else {
			super.error(message, trace, context);
		}
	}

	warn(message: unknown, context?: string): void {
		if (!this.shouldLog("warn")) return;

		if (this.isJson) {
			console.warn(this.formatJsonLog("warn", message, context));
		} else {
			super.warn(message, context);
		}
	}

	debug(message: unknown, context?: string): void {
		if (!this.shouldLog("debug")) return;

		if (this.isJson) {
			console.debug(this.formatJsonLog("debug", message, context));
		} else {
			super.debug(message, context);
		}
	}

	verbose(message: unknown, context?: string): void {
		if (!this.shouldLog("verbose")) return;

		if (this.isJson) {
			console.log(this.formatJsonLog("verbose", message, context));
		} else {
			super.verbose(message, context);
		}
	}

	fatal(message: unknown, context?: string): void {
		if (!this.shouldLog("fatal")) return;

		if (this.isJson) {
			console.error(this.formatJsonLog("fatal", message, context));
		} else {
			super.fatal(message, context);
		}
	}
}
