import { Body, Controller, Get, Post } from "@nestjs/common";
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import type { SelectItem } from "@repo/db";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { CreateItemDto, ItemDto } from "./dto";
// biome-ignore lint/style/useImportType: NestJS DI requires runtime import
import { ItemsService } from "./items.service";

@ApiTags("items")
@Controller("api/items")
export class ItemsController {
	constructor(private readonly itemsService: ItemsService) {}

	@Get()
	@ApiOperation({ summary: "List all items" })
	@ApiOkResponse({
		description: "Items list.",
		type: ItemDto,
		isArray: true,
	})
	async getAll(@Session() _session: UserSession): Promise<SelectItem[]> {
		return this.itemsService.findAll();
	}

	@Post()
	@ApiOperation({ summary: "Create a new item" })
	@ApiBody({ type: CreateItemDto })
	@ApiCreatedResponse({
		description: "Created item.",
		type: ItemDto,
	})
	async create(
		@Body() createItemDto: CreateItemDto,
		@Session() session: UserSession,
	): Promise<SelectItem> {
		return this.itemsService.create(createItemDto, session.user.id);
	}
}
