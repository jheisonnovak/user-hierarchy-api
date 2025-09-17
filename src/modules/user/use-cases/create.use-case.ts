import { Injectable } from "@nestjs/common";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { NodeService } from "../../hierarchy/services/node.service";
import { CreateNodeUseCase } from "../../hierarchy/use-cases/create-node.use-case";
import { CreateUserDto } from "../models/dtos/create.dto";
import { ListUserDto } from "../models/dtos/list.dto";

@Injectable()
export class CreateUserUseCase {
	constructor(
		private readonly nodeService: NodeService,
		private readonly createNodeUseCase: CreateNodeUseCase
	) {}

	async execute(dto: CreateUserDto): Promise<ListUserDto> {
		await this.nodeService.validateEmailUniqueness(dto.email);
		const user = await this.createNodeUseCase.execute(NodeType.USER, dto.name, dto.email);
		return new ListUserDto(user.id, user.name, user.email, user.createdAt, user.updatedAt);
	}
}
