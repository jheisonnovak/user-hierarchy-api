import { applyDecorators } from "@nestjs/common";
import { IsString, Length, Matches } from "class-validator";

interface IsObjectiveStringOptions {
	minLength?: number;
	maxLength?: number;
}

export function IsObjectiveString({ minLength = 0, maxLength = 100 }: IsObjectiveStringOptions = {}): PropertyDecorator {
	const decorators = [
		IsString(),
		Length(minLength, maxLength, {
			message: `Should be between ${minLength} and ${maxLength} characters`,
		}),
		Matches(/^[a-zA-ZÀ-ÿ0-9\s\-._()&]+$/, {
			message: "Should contain only letters, numbers, spaces, and basic punctuation characters",
		}),
	];

	return applyDecorators(...decorators);
}
