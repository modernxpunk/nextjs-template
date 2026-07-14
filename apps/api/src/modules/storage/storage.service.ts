import { randomUUID } from "node:crypto";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { extractOwnedStorageKey } from "./storage-url";

@Injectable()
export class StorageService {
	private readonly s3: S3Client;
	private readonly bucket: string;
	private readonly publicUrl: string;

	constructor() {
		this.bucket = process.env.S3_BUCKET?.trim() || "uploads";
		if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(this.bucket)) {
			throw new Error("S3_BUCKET is not a valid bucket name");
		}

		const endpoint = this.requireHttpUrl(
			"S3_ENDPOINT",
			this.requireEnvironmentVariable("S3_ENDPOINT"),
		);
		this.publicUrl = this.requireHttpUrl(
			"S3_PUBLIC_URL",
			process.env.S3_PUBLIC_URL?.trim() || endpoint,
		).replace(/\/+$/, "");

		this.s3 = new S3Client({
			endpoint,
			region: process.env.S3_REGION || "us-east-1",
			credentials: {
				accessKeyId: this.requireEnvironmentVariable("S3_ACCESS_KEY"),
				secretAccessKey: this.requireEnvironmentVariable("S3_SECRET_KEY"),
			},
			forcePathStyle: true, // Required for RustFS/MinIO
		});
	}

	async uploadFile(
		file: Buffer,
		options: { contentType: string; extension: string },
		folder: string = "",
	): Promise<string> {
		const key = folder
			? `${folder}/${randomUUID()}${options.extension}`
			: `${randomUUID()}${options.extension}`;

		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: file,
				ContentType: options.contentType,
			}),
		);

		return `${this.publicUrl}/${this.bucket}/${key}`;
	}

	async deleteFile(fileUrl: string, expectedPrefix?: string): Promise<void> {
		const key = this.extractKeyFromUrl(fileUrl);
		if (!key || (expectedPrefix && !key.startsWith(expectedPrefix))) return;

		await this.s3.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: key,
			}),
		);
	}

	async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});
		return getSignedUrl(this.s3, command, { expiresIn });
	}

	private extractKeyFromUrl(url: string): string | null {
		return extractOwnedStorageKey(url, this.publicUrl, this.bucket);
	}

	private requireEnvironmentVariable(name: string): string {
		const value = process.env[name]?.trim();
		if (!value) {
			throw new Error(`${name} environment variable is not set`);
		}
		return value;
	}

	private requireHttpUrl(name: string, value: string): string {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new Error(`${name} must use http or https`);
		}
		return value;
	}
}
