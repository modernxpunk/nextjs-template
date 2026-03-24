import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
	input: {
		path: "../api/openapi.json",
	},
	output: {
		path: "./src/lib/api/generated",
		clean: true,
	},
	plugins: [
		pluginOas({
			validate: false,
		}),
		pluginTs({
			output: {
				path: "types.ts",
			},
			include: [
				{ type: "path", pattern: "/health" },
				{ type: "path", pattern: "/api/items" },
				{ type: "path", pattern: /^\/api\/auth\/admin\// },
			],
			syntaxType: "type",
			enumType: "asConst",
		}),
	],
});
