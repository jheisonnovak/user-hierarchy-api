import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { ClosureTypeOrmRepository } from "../repositories/closure.repository";

@Injectable()
export class CreateClosureSelfLinkUseCase {
	constructor(private readonly closureRepository: ClosureTypeOrmRepository) {}

	async execute(nodeId: string, entityManager?: EntityManager): Promise<void> {
		const exists = await this.closureRepository.findByAncestorAndDescendant(nodeId, nodeId, entityManager);
		if (!exists) await this.closureRepository.create({ ancestorId: nodeId, descendantId: nodeId, depth: 0 }, entityManager);
	}
}
