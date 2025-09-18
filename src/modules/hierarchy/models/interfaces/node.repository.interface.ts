import { EntityManager } from "typeorm";
import { NodeEntity } from "../entities/node.entity";

export interface INodeRepository {
	create(nodeData: Partial<NodeEntity>, entityManager?: EntityManager): Promise<NodeEntity>;
	existsByEmail(email: string): Promise<boolean>;
	findById(id: string, entityManager?: EntityManager): Promise<NodeEntity | null>;
}
