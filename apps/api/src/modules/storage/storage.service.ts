import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
	private s3: S3Client;
	private bucket: string;
	private publicUrl: string;

	constructor() {
		this.bucket = process.env.S3_BUCKET || "uploads";
		this.publicUrl = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "";

		this.s3 = new S3Client({
			endpoint: process.env.S3_ENDPOINT,
			region: process.env.S3_REGION || "us-east-1",
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY || "",
				secretAccessKey: process.env.S3_SECRET_KEY || "",
			},
			forcePathStyle: true, // Required for RustFS/MinIO
		});
	}

	async uploadFile(
		file: Buffer,
		originalName: string,
		folder: string = "",
	): Promise<string> {
		const ext = extname(originalName);
		const key = folder
			? `${folder}/${randomUUID()}${ext}`
			: `${randomUUID()}${ext}`;

		await this.s3.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: file,
				ContentType: this.getContentType(ext),
			}),
		);

		return `${this.publicUrl}/${this.bucket}/${key}`;
	}

	async deleteFile(fileUrl: string): Promise<void> {
		const key = this.extractKeyFromUrl(fileUrl);
		if (!key) return;

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
		try {
			const urlObj = new URL(url);
			const pathParts = urlObj.pathname.split("/");
			// Remove bucket name from path
			if (pathParts[1] === this.bucket) {
				return pathParts.slice(2).join("/");
			}
			return pathParts.slice(1).join("/");
		} catch {
			return null;
		}
	}

	private getContentType(ext: string): string {
		const mimeTypes: Record<string, string> = {
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".png": "image/png",
			".gif": "image/gif",
			".webp": "image/webp",
			".svg": "image/svg+xml",
		};
		return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
	}
}
