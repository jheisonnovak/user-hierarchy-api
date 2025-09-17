import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { CreateClosureSelfLinkUseCase } from "../../hierarchy/use-cases/create-closure-self-link.use-case";
import { CreateNodeUseCase } from "../../hierarchy/use-cases/create-node.use-case";
import { ValidateEmailUniquenessUseCase } from "../../hierarchy/use-cases/validate-email-uniqueness.use-case";
import { CreateUserDto } from "../models/dtos/create.dto";
import { ListUserDto } from "../models/dtos/list.dto";

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly validateEmailUniquenessUseCase: ValidateEmailUniquenessUseCase,
		private readonly createNodeUseCase: CreateNodeUseCase,
		private readonly dataSource: DataSource,
		private readonly createClosureSelfLinkUseCase: CreateClosureSelfLinkUseCase
	) {}

	async execute(dto: CreateUserDto): Promise<ListUserDto> {
		await this.validateEmailUniquenessUseCase.execute(dto.email);
		const user = await this.dataSource.transaction(async entityManager => {
			const user = await this.createNodeUseCase.execute(NodeType.USER, dto.name, dto.email, entityManager);
			await this.createClosureSelfLinkUseCase.execute(user.id, entityManager);
			return user;
		});
		return new ListUserDto(user.id, user.name, user.email, user.createdAt);
	}
}
