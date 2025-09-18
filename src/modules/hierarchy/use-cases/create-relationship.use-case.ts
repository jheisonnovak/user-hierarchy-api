import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { NodeEntity } from "../models/entities/node.entity";
import { IClosureRepository } from "../models/interfaces/closure.repository.interface";
import { INodeRepository } from "../models/interfaces/node.repository.interface";
import { CreateClosureSelfLinkUseCase } from "./create-closure-self-link.use-case";

@Injectable()
export class CreateRelationshipUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository,
		@Inject("IClosureRepository")
		private readonly closureRepository: IClosureRepository,
		private readonly createClosureSelfLinkUseCase: CreateClosureSelfLinkUseCase
	) {}

	async execute(parentId: string, childId: string, entityManager?: EntityManager): Promise<void> {
		await this.findAndValidateParentAndChild(parentId, childId, entityManager);

		await this.createClosureSelfLinkUseCase.execute(parentId, entityManager);
		await this.createClosureSelfLinkUseCase.execute(childId, entityManager);

		await this.closureRepository.createRelationshipsBatch(parentId, childId, entityManager);
	}

	private async findAndValidateParentAndChild(
		parentId: string,
		childId: string,
		entityManager?: EntityManager
	): Promise<{ parent: NodeEntity; child: NodeEntity }> {
		const parent = await this.nodeRepository.findById(parentId, entityManager);
		const child = await this.nodeRepository.findById(childId, entityManager);

		if (!parent || !child) throw new NotFoundException("The parent or the child was not found");
		if (parentId === childId) throw new ConflictException("Cyclic relationship is not allowed");

		const existingCycle = await this.closureRepository.findByAncestorAndDescendant(childId, parentId);
		if (existingCycle) throw new ConflictException("Cyclic relationship is not allowed");
		return { parent, child };
	}
}
