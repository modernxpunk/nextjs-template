import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateItemDto {
	@ApiProperty({
		description: "Display name of the item.",
		example: "My first item",
		maxLength: 20,
	})
	@Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
	@IsString()
	@MinLength(1)
	@MaxLength(20)
	name!: string;
}
