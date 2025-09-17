import { EntityManager } from "typeorm";
import { ClosureEntity } from "../entities/closure.entity";

export interface IClosureRepository {
	create(closureData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<ClosureEntity>;
	createMany(closureData: Partial<ClosureEntity>[], entityManager?: EntityManager): Promise<ClosureEntity[]>;
	findByAncestorAndDescendant(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity | null>;
	findAncestorsWithMinDepth(
		descendantId: string,
		minDepth?: number,
		entityManager?: EntityManager
	): Promise<Array<{ ancestorId: string; depth: number }>>;
	findDescendantsWithMinDepth(
		ancestorId: string,
		minDepth?: number,
		entityManager?: EntityManager
	): Promise<Array<{ descendantId: string; depth: number }>>;
	hasPath(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<boolean>;
	update(ancestorId: string, descendantId: string, updateData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<void>;
}
