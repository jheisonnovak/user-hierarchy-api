import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { IsObjectiveString } from "../../../../common/decorators/is-objetive-string.decorator";

export class CreateUserDto {
	@Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
	@IsNotEmpty()
	@IsObjectiveString({ minLength: 2, maxLength: 255 })
	name: string;

	@Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: "Invalid email address" })
	@Length(5, 255, { message: "Email should be between 5 and 255 characters" })
	email: string;
}
