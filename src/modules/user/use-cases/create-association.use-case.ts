import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { CreateRelationshipUseCase } from "../../hierarchy/use-cases/create-relationship.use-case";
import { FindAndValidateNodeUseCase } from "../../hierarchy/use-cases/find-and-validate-node.use-case";
import { CreateAssociationDto } from "../models/dtos/create-association.dto";

@Injectable()
export class CreateAssociationUserUseCase {
	constructor(
		private readonly findAndValidateNodeUseCase: FindAndValidateNodeUseCase,
		private readonly createRelationshipUseCase: CreateRelationshipUseCase,
		private readonly dataSource: DataSource
	) {}

	async execute(id: string, dto: CreateAssociationDto): Promise<void> {
		const group = await this.findAndValidateNodeUseCase.execute(dto.groupId, NodeType.GROUP);
		const user = await this.findAndValidateNodeUseCase.execute(id); // TODO Verificar se pode criar além de usuário
		// TODO optimize with a single search query
		await this.dataSource.transaction(async manager => await this.createRelationshipUseCase.execute(group.id, user.id, manager));
	}
}
