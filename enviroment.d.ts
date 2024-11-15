/* eslint-disable no-unused-vars */
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Default environment variables
			NODE_ENV: "development" | "production";
			PORT?: string;
			PWD?: string;

			REQUIRED_VAR: string;
			OPTIONAL_VAR?: string;
		}
	}
}

export {};
