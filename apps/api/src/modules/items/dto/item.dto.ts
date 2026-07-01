import { ApiProperty } from "@nestjs/swagger";

export class ItemDto {
	@ApiProperty({
		example: "clx5dhnwo0000abc123xyz",
		description: "Unique item identifier",
	})
	id: string;

	@ApiProperty({
		example: "My first item",
		description: "Display name of the item",
	})
	name: string;

	@ApiProperty({
		example: "clx5dhm7e0001abc123xyz",
		description: "ID of the user who owns the item",
	})
	userId: string;
}
