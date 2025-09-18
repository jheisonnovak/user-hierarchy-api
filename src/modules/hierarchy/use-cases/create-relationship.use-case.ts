import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { NodeEntity } from "../models/entities/node.entity";
import { IClosureRepository } from "../models/interfaces/closure.repository.interface";

@Injectable()
export class CreateRelationshipUseCase {
	constructor(
		@Inject("IClosureRepository")
		private readonly closureRepository: IClosureRepository
	) {}

	async execute(parent: NodeEntity, child: NodeEntity, entityManager?: EntityManager): Promise<void> {
		await this.findAndValidateParentAndChild(parent, child, entityManager);
		await this.closureRepository.createRelationshipsBatch(parent.id, child.id, entityManager);
	}

	private async findAndValidateParentAndChild(
		parent: NodeEntity,
		child: NodeEntity,
		entityManager?: EntityManager
	): Promise<{ parent: NodeEntity; child: NodeEntity }> {
		if (parent === child) throw new ConflictException("Cyclic relationship is not allowed");

		const closure = await this.closureRepository.findRelationBetweenNodes(parent.id, child.id, entityManager);
		const existingCycle = closure && closure.ancestorId === child.id && closure.descendantId === parent.id;
		const existingRelationship = closure && closure.ancestorId === parent.id && closure.descendantId === child.id;
		if (existingCycle) throw new ConflictException("Cyclic relationship is not allowed");
		if (existingRelationship) throw new ConflictException("Relationship already exists");

		return { parent, child };
	}
}
