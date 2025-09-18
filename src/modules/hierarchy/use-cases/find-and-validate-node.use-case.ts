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

	async execute(id: string, type?: NodeType): Promise<NodeEntity> {
		const node = type ? await this.nodeRepository.findByIdAndType(id, type) : await this.nodeRepository.findById(id);
		if (!node) throw new NotFoundException(`The ${type ?? "node"} was not found`);
		return node;
	}
}
