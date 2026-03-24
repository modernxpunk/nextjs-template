import {
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	Post,
} from "@nestjs/common";
import { db, item, type SelectItem } from "@repo/db";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { IsNotEmpty, Length } from "class-validator";
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiProperty,
	ApiTags,
} from "@nestjs/swagger";

class CreateItemDto {
	@ApiProperty({
		description: "Display name of the item.",
		example: "My first item",
		maxLength: 20,
	})
	@IsNotEmpty()
	@Length(0, 20)
	name: string;
}

class ItemDto {
	@ApiProperty({ example: "clx5dhnwo0000abc123xyz" })
	id: string;

	@ApiProperty({ example: "My first item" })
	name: string;

	@ApiProperty({ example: "clx5dhm7e0001abc123xyz" })
	userId: string;
}

@ApiTags("items")
@Controller("api/items")
export class ItemsController {
	@Get()
	@ApiOperation({ summary: "List all items" })
	@ApiOkResponse({
		description: "Items list.",
		type: ItemDto,
		isArray: true,
	})
	async getAll(@Session() _session: UserSession): Promise<SelectItem[]> {
		try {
			return await db.select().from(item);
		} catch (error) {
			console.error("Error fetching items:", error);
			throw new InternalServerErrorException("Internal server error");
		}
	}

	@Post()
	@ApiOperation({ summary: "Create a new item" })
	@ApiBody({ type: CreateItemDto })
	@ApiCreatedResponse({
		description: "Created item.",
		type: ItemDto,
	})
	async create(
		@Body() body: CreateItemDto,
		@Session() session: UserSession,
	): Promise<SelectItem> {
		try {
			const [createdItem] = await db
				.insert(item)
				.values({
					id: crypto.randomUUID(),
					name: body.name,
					userId: session.user.id,
				})
				.returning();

			if (!createdItem) {
				throw new InternalServerErrorException("Internal server error");
			}

			return createdItem;
		} catch (error) {
			console.error("Error creating item:", error);
			throw new InternalServerErrorException("Internal server error");
		}
	}
}
