import { EntityManager } from "typeorm";
import { ClosureEntity } from "../entities/closure.entity";

export interface IClosureRepository {
	create(closureData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<ClosureEntity>;
	findByAncestorAndDescendant(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity | null>;
}
