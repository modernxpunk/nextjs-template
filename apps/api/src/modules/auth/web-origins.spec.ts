import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseWebOrigins } from "./web-origins.ts";

describe("parseWebOrigins", () => {
	it("normalizes and deduplicates configured origins", () => {
		assert.deepEqual(
			parseWebOrigins("https://app.example.com/, https://app.example.com"),
			["https://app.example.com"],
		);
	});

	it("rejects origins containing a path", () => {
		assert.throws(() => parseWebOrigins("https://app.example.com/path"));
	});
});
