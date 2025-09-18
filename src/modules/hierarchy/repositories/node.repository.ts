import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { NodeEntity } from "../models/entities/node.entity";
import { NodeType } from "../models/enums/node-type.enum";
import { HierarchyNode } from "../models/interfaces/hierarchy.interface";
import { INodeRepository } from "../models/interfaces/node.repository.interface";

@Injectable()
export class NodeTypeOrmRepository implements INodeRepository {
	constructor(
		@InjectRepository(NodeEntity)
		private readonly repository: Repository<NodeEntity>
	) {}

	async createWithSelfLink(nodeData: Partial<NodeEntity>, entityManager?: EntityManager): Promise<NodeEntity> {
		const repo = entityManager ? entityManager.getRepository(NodeEntity) : this.repository;
		const node = await repo.query<NodeEntity[]>(
			`
		WITH inserted_node AS (
            INSERT INTO nodes (name, email, type) 
            VALUES ($1, $2, $3) 
            RETURNING *
        ),
        inserted_closure AS (
            INSERT INTO closure (ancestor_id, descendant_id, depth)
            SELECT id, id, 0 FROM inserted_node
        )
        SELECT * FROM inserted_node`,
			[nodeData.name, nodeData.email, nodeData.type]
		);
		return node[0];
	}

	async existsByEmail(email: string): Promise<boolean> {
		return this.repository.exists({ where: { email } });
	}

	async findById(id: string, entityManager?: EntityManager): Promise<NodeEntity | null> {
		const repo = entityManager ? entityManager.getRepository(NodeEntity) : this.repository;
		return repo.findOne({ where: { id } });
	}

	async findByIdAndType(id: string, type: NodeType, entityManager?: EntityManager): Promise<NodeEntity | null> {
		const repo = entityManager ? entityManager.getRepository(NodeEntity) : this.repository;
		return repo.findOne({ where: { id, type } });
	}

	async findDescendantsById(id: string, entityManager?: EntityManager): Promise<HierarchyNode[]> {
		const repo = entityManager ? entityManager.getRepository(NodeEntity) : this.repository;
		return await repo
			.createQueryBuilder("node")
			.select(["node.id AS id", "node.name AS name", "closure.depth AS depth"])
			.innerJoin("closure", "closure", "closure.ancestor_id = :id AND closure.descendant_id = node.id AND closure.depth > 0", { id })
			.orderBy("closure.depth", "ASC")
			.getRawMany<HierarchyNode>();
	}

	async findAncestorsById(id: string, entityManager?: EntityManager): Promise<HierarchyNode[]> {
		const repo = entityManager ? entityManager.getRepository(NodeEntity) : this.repository;
		return await repo
			.createQueryBuilder("node")
			.select(["node.id AS id", "node.name AS name", "closure.depth AS depth"])
			.innerJoin("closure", "closure", "closure.descendant_id = :id AND closure.ancestor_id = node.id AND closure.depth > 0", { id })
			.orderBy("closure.depth", "ASC")
			.getRawMany<HierarchyNode>();
	}

	async findAncestorsByIdAndType(id: string, type: NodeType, entityManager?: EntityManager): Promise<HierarchyNode[]> {
		const repo = entityManager ? entityManager.getRepository(NodeEntity) : this.repository;
		return await repo
			.createQueryBuilder("node")
			.select(["node.id AS id", "node.name AS name", "closure.depth AS depth"])
			.innerJoin("closure", "closure", "closure.descendant_id = :id AND closure.ancestor_id = node.id AND closure.depth > 0", { id })
			.where("node.type = :type", { type })
			.orderBy("closure.depth", "ASC")
			.getRawMany<HierarchyNode>();
	}
}
