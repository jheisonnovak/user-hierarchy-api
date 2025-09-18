import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAssociationDto {
	@IsNotEmpty()
	@IsString()
	@IsUUID("4")
	groupId: string;
}
