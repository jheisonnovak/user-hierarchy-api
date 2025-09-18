import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { CreateClosureSelfLinkUseCase } from "../../hierarchy/use-cases/create-closure-self-link.use-case";
import { CreateNodeUseCase } from "../../hierarchy/use-cases/create-node.use-case";
import { CreateRelationshipUseCase } from "../../hierarchy/use-cases/create-relationship.use-case";
import { CreateGroupDto } from "../models/dtos/create.dto";
import { ListGroupDto } from "../models/dtos/list.dto";

@Injectable()
export class CreateGroupUseCase {
	constructor(
		private readonly createNodeUseCase: CreateNodeUseCase,
		private readonly dataSource: DataSource,
		private readonly createClosureSelfLinkUseCase: CreateClosureSelfLinkUseCase,
		private readonly createRelationshipUseCase: CreateRelationshipUseCase
	) {}

	async execute(dto: CreateGroupDto): Promise<ListGroupDto> {
		const group = await this.dataSource.transaction(async entityManager => {
			const group = await this.createNodeUseCase.execute(NodeType.GROUP, dto.name, undefined, entityManager);
			await this.createClosureSelfLinkUseCase.execute(group.id, entityManager);
			if (dto.parentId) await this.createRelationshipUseCase.execute(dto.parentId, group.id, entityManager);
			return group;
		});
		return new ListGroupDto(group.id, group.name, group.createdAt);
	}
}
