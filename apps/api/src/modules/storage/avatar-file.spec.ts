import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BadRequestException } from "@nestjs/common";
import {
	MAX_AVATAR_FILE_SIZE,
	type UploadedAvatarFile,
	validateAvatarFile,
} from "./avatar-file.ts";

function createFile(buffer: Buffer, mimetype: string): UploadedAvatarFile {
	return {
		buffer,
		mimetype,
		size: buffer.length,
		originalname: "untrusted-name.exe",
	};
}

describe("validateAvatarFile", () => {
	it("accepts a JPEG by its byte signature", () => {
		const result = validateAvatarFile(
			createFile(Buffer.from([0xff, 0xd8, 0xff, 0x00]), "image/jpeg"),
		);

		assert.deepEqual(result, {
			contentType: "image/jpeg",
			extension: ".jpg",
		});
	});

	it("rejects a spoofed MIME type", () => {
		assert.throws(
			() =>
				validateAvatarFile(
					createFile(Buffer.from("not an image"), "image/png"),
				),
			BadRequestException,
		);
	});

	it("rejects an oversized buffer even when the reported size is small", () => {
		const file = createFile(
			Buffer.alloc(MAX_AVATAR_FILE_SIZE + 1),
			"image/jpeg",
		);
		file.size = 1;

		assert.throws(() => validateAvatarFile(file), BadRequestException);
	});
});
