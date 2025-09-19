import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { NodeEntity } from "../models/entities/node.entity";
import { NodeType } from "../models/enums/node-type.enum";
import { INodeRepository } from "../models/interfaces/node.repository.interface";

@Injectable()
export class FindAndValidateNodeUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository
	) {}

	async execute(id: string, type?: NodeType, entityManager?: EntityManager): Promise<NodeEntity> {
		const node = type
			? await this.nodeRepository.findByIdAndType(id, type, entityManager)
			: await this.nodeRepository.findById(id, entityManager);
		if (!node) throw new NotFoundException(`The ${type ?? "node"} was not found`);
		return node;
	}
}
