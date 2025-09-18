import { EntityManager } from "typeorm";
import { NodeEntity } from "../entities/node.entity";
import { NodeType } from "../enums/node-type.enum";
import { HierarchyNode } from "./hierarchy.interface";

export interface INodeRepository {
	createWithSelfLink(nodeData: Partial<NodeEntity>, entityManager?: EntityManager): Promise<NodeEntity>;
	existsByEmail(email: string): Promise<boolean>;
	findById(id: string, entityManager?: EntityManager): Promise<NodeEntity | null>;
	findByIdAndType(id: string, type: NodeType, entityManager?: EntityManager): Promise<NodeEntity | null>;
	findDescendantsById(id: string, entityManager?: EntityManager): Promise<HierarchyNode[]>;
	findAncestorsById(id: string, entityManager?: EntityManager): Promise<HierarchyNode[]>;
	findAncestorsByIdAndType(id: string, type: NodeType, entityManager?: EntityManager): Promise<HierarchyNode[]>;
}
