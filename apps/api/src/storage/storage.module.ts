import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
	controllers: [UploadController],
	providers: [StorageService, UploadService],
	exports: [StorageService],
})
export class StorageModule {}
