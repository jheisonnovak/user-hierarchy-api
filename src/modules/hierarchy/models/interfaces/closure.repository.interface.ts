import { EntityManager } from "typeorm";
import { ClosureEntity } from "../entities/closure.entity";

export interface IClosureRepository {
	create(closureData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<ClosureEntity>;
	findByAncestorAndDescendant(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity | null>;
	findRelationBetweenNodes(firstId: string, secondId: string, entityManager?: EntityManager): Promise<ClosureEntity | null>;
	findAncestors(descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity[]>;
	findDescendants(ancestorId: string, entityManager?: EntityManager): Promise<ClosureEntity[]>;
	createRelationshipsBatch(parentId: string, childId: string, entityManager?: EntityManager): Promise<void>;
}
