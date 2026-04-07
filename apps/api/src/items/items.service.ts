import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { item, type SelectItem } from "@repo/db";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { DatabaseService } from "../database/database.service";
import type { CreateItemDto } from "./dto/create-item.dto";

@Injectable()
export class ItemsService {
	private readonly logger = new Logger(ItemsService.name);

	constructor(private readonly databaseService: DatabaseService) {}

	async findAll(): Promise<SelectItem[]> {
		try {
			return await this.databaseService.db.select().from(item);
		} catch (error) {
			this.logger.error("Error fetching items:", error);
			throw new InternalServerErrorException("Failed to fetch items");
		}
	}

	async create(
		createItemDto: CreateItemDto,
		userId: string,
	): Promise<SelectItem> {
		try {
			const [createdItem] = await this.databaseService.db
				.insert(item)
				.values({
					id: crypto.randomUUID(),
					name: createItemDto.name,
					userId,
				})
				.returning();

			if (!createdItem) {
				throw new InternalServerErrorException("Failed to create item");
			}

			return createdItem;
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw error;
			}
			this.logger.error("Error creating item:", error);
			throw new InternalServerErrorException("Failed to create item");
		}
	}
}
