import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { CreateNodeWithSelfLinkUseCase } from "../../hierarchy/use-cases/create-node.use-case";
import { CreateRelationshipUseCase } from "../../hierarchy/use-cases/create-relationship.use-case";
import { FindAndValidateNodeUseCase } from "../../hierarchy/use-cases/find-and-validate-node.use-case";
import { CreateGroupDto } from "../models/dtos/create.dto";
import { ListGroupDto } from "../models/dtos/list.dto";

@Injectable()
export class CreateGroupUseCase {
	constructor(
		private readonly createNodeWithSelfLinkUseCase: CreateNodeWithSelfLinkUseCase,
		private readonly dataSource: DataSource,
		private readonly createRelationshipUseCase: CreateRelationshipUseCase,
		private readonly findAndValidateNodeUseCase: FindAndValidateNodeUseCase
	) {}

	async execute(dto: CreateGroupDto): Promise<ListGroupDto> {
		const group = await this.dataSource.transaction(async entityManager => {
			const group = await this.createNodeWithSelfLinkUseCase.execute(NodeType.GROUP, dto.name, undefined, entityManager);
			if (dto.parentId) {
				const parentGroup = await this.findAndValidateNodeUseCase.execute(dto.parentId, NodeType.GROUP);
				await this.createRelationshipUseCase.execute(parentGroup, group, entityManager);
			}
			return group;
		});
		return new ListGroupDto(group.id, group.type, group.name, group.createdAt);
	}
}
