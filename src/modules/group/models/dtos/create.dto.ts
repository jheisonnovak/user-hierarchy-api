import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsObjectiveString } from "../../../../common/decorators/is-objetive-string.decorator";

export class CreateGroupDto {
	@Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
	@IsNotEmpty()
	@IsObjectiveString({ minLength: 2, maxLength: 255 })
	name: string;

	@IsOptional()
	@IsString()
	@IsUUID("4")
	parentId?: string;
}
