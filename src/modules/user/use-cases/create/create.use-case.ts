import { Injectable } from "@nestjs/common";
import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";
import { CreateNodeWithSelfLinkUseCase } from "../../../hierarchy/use-cases/create-node-with-self-link/create-node-with-self-link.use-case";
import { ValidateEmailUniquenessUseCase } from "../../../hierarchy/use-cases/validate-email-uniqueness/validate-email-uniqueness.use-case";
import { CreateUserDto } from "../../models/dtos/create.dto";
import { ListUserDto } from "../../models/dtos/list.dto";

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly validateEmailUniquenessUseCase: ValidateEmailUniquenessUseCase,
		private readonly createNodeWithSelfLinkUseCase: CreateNodeWithSelfLinkUseCase
	) {}

	async execute(dto: CreateUserDto): Promise<ListUserDto> {
		await this.validateEmailUniquenessUseCase.execute(dto.email);
		const user = await this.createNodeWithSelfLinkUseCase.execute(NodeType.USER, dto.name, dto.email);
		return new ListUserDto(user.id, user.type, user.name, user.email, user.createdAt);
	}
}
