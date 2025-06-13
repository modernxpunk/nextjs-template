import type { routing } from '@/i18n/routing';
import type { formats } from '@/i18n/request';
import type messages from './messages/en.json';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Default environment variables
			NODE_ENV: "development" | "production";
			PORT?: string;
			PWD?: string;

			REQUIRED_VAR: string;
			OPTIONAL_VAR?: string;
			DATABASE_URL: string;

			EMAIL_USER: string;
			EMAIL_PASS: string;

			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
		}
	}
}

declare module 'next-intl' {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: typeof messages;
		Formats: typeof formats;
	}
}

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
