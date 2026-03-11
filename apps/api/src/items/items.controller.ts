import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpException,
	InternalServerErrorException,
	Post,
} from "@nestjs/common";
import { db, item, type SelectItem } from "@repo/db";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

type CreateItemBody = {
	name: string;
	userId?: string;
};

@Controller("api/items")
export class ItemsController {
	@Get()
	async getAll(@Session() _session: UserSession): Promise<SelectItem[]> {
		try {
			return await db.select().from(item);
		} catch (error) {
			console.error("Error fetching items:", error);
			throw new InternalServerErrorException("Internal server error");
		}
	}

	@Post()
	async create(
		@Body() body: CreateItemBody,
		@Session() session: UserSession,
	): Promise<SelectItem> {
		try {
			const trimmedName = body.name?.trim();
			if (!trimmedName) {
				throw new BadRequestException("name is required");
			}

			const userId = body.userId ?? session.user.id;
			if (userId !== session.user.id) {
				throw new ForbiddenException("Forbidden");
			}

			const [createdItem] = await db
				.insert(item)
				.values({
					id: crypto.randomUUID(),
					name: trimmedName,
					userId,
				})
				.returning();

			if (!createdItem) {
				throw new InternalServerErrorException("Internal server error");
			}

			return createdItem;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}

			console.error("Error creating user:", error);
			throw new InternalServerErrorException("Internal server error");
		}
	}
}
