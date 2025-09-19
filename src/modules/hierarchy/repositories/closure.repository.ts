import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ClosureEntity } from "../models/entities/closure.entity";
import { IClosureRepository } from "../models/interfaces/closure.repository.interface";

@Injectable()
export class ClosureTypeOrmRepository implements IClosureRepository {
	constructor(
		@InjectRepository(ClosureEntity)
		private readonly closureRepository: Repository<ClosureEntity>
	) {}

	async create(closureData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<ClosureEntity> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.save(closureData);
	}

	async findByAncestorAndDescendant(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity | null> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.findOne({ where: { ancestorId, descendantId } });
	}
	async findRelationBetweenNodes(firstNodeId: string, secondNodeId: string, entityManager?: EntityManager): Promise<ClosureEntity | null> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository
			.createQueryBuilder("closure")
			.where("closure.ancestor_id = :firstNodeId AND closure.descendant_id = :secondNodeId", { firstNodeId, secondNodeId })
			.orWhere("closure.ancestor_id = :secondNodeId AND closure.descendant_id = :firstNodeId", { firstNodeId, secondNodeId })
			.getOne();
	}

	async findAncestors(descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity[]> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.find({ where: { descendantId } });
	}

	async findDescendants(ancestorId: string, entityManager?: EntityManager): Promise<ClosureEntity[]> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.find({ where: { ancestorId } });
	}

	async createRelationshipsBatch(parentId: string, childId: string, entityManager?: EntityManager): Promise<void> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		await repository.query(
			`INSERT INTO closure (ancestor_id, descendant_id, depth)
        SELECT 
            ct.ancestor_id,
            ctcj.descendant_id, 
            (ct.depth + 1 + ctcj.depth) as depth
        FROM closure ct
        CROSS JOIN closure ctcj
        WHERE ct.descendant_id = $1 
          AND ctcj.ancestor_id = $2
		ON CONFLICT (ancestor_id, descendant_id) DO NOTHING`,
			[parentId, childId]
		);
	}
}
