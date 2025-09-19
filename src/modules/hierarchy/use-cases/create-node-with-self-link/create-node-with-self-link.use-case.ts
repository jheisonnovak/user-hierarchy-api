import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { NodeEntity } from "../../models/entities/node.entity";
import { NodeType } from "../../models/enums/node-type.enum";
import { INodeRepository } from "../../models/interfaces/node.repository.interface";

@Injectable()
export class CreateNodeWithSelfLinkUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository
	) {}

	async execute(type: NodeType, name: string, email?: string, entityManager?: EntityManager): Promise<NodeEntity> {
		const node = new NodeEntity({ name, email, type });
		return this.nodeRepository.createWithSelfLink(node, entityManager);
	}
}
