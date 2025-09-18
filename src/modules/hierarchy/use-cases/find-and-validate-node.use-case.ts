import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { NodeEntity } from "../models/entities/node.entity";
import { NodeType } from "../models/enums/node-type.enum";
import { INodeRepository } from "../models/interfaces/node.repository.interface";

@Injectable()
export class FindAndValidateNodeUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository
	) {}

	async execute(id: string, type: NodeType): Promise<NodeEntity> {
		const node = await this.nodeRepository.findByIdAndType(id, type);
		if (!node) throw new NotFoundException(`The ${type} was not found`);
		return node;
	}
}
