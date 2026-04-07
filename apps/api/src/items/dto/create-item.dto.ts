import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateItemDto {
	@ApiProperty({
		description: "Display name of the item.",
		example: "My first item",
		maxLength: 20,
	})
	@IsNotEmpty()
	@MaxLength(20)
	name: string;
}
