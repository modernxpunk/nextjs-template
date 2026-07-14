import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractOwnedStorageKey } from "./storage-url.ts";

describe("extractOwnedStorageKey", () => {
	it("extracts a key from the configured origin and bucket", () => {
		assert.equal(
			extractOwnedStorageKey(
				"https://assets.example.com/root/uploads/avatars/one.jpg",
				"https://assets.example.com/root",
				"uploads",
			),
			"avatars/one.jpg",
		);
	});

	it("does not map an external URL into the local bucket", () => {
		assert.equal(
			extractOwnedStorageKey(
				"https://profiles.example.net/uploads/avatars/one.jpg",
				"https://assets.example.com",
				"uploads",
			),
			null,
		);
	});

	it("rejects a different path prefix", () => {
		assert.equal(
			extractOwnedStorageKey(
				"https://assets.example.com/uploads-private/avatars/one.jpg",
				"https://assets.example.com",
				"uploads",
			),
			null,
		);
	});
});
