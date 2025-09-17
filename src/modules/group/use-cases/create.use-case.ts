import { Injectable } from "@nestjs/common";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { CreateNodeUseCase } from "../../hierarchy/use-cases/create-node.use-case";
import { CreateGroupDto } from "../models/dtos/create.dto";
import { ListGroupDto } from "../models/dtos/list.dto";

@Injectable()
export class CreateGroupUseCase {
	constructor(private readonly createNodeUseCase: CreateNodeUseCase) {}

	async execute(dto: CreateGroupDto): Promise<ListGroupDto> {
		const user = await this.createNodeUseCase.execute(NodeType.GROUP, dto.name);
		return new ListGroupDto(user.id, user.name, user.createdAt, user.updatedAt);
	}
}
