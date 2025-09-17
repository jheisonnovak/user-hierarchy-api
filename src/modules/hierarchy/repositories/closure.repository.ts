import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ClosureEntity } from "../models/entities/closure.entity";

@Injectable()
export class ClosureRepository {
	constructor(
		@InjectRepository(ClosureEntity)
		private readonly closureRepository: Repository<ClosureEntity>
	) {}

	async create(closureData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<ClosureEntity> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		const closure = repository.create(closureData);
		return repository.save(closure);
	}

	async createMany(closureData: Partial<ClosureEntity>[], entityManager?: EntityManager): Promise<ClosureEntity[]> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		const closures = repository.create(closureData);
		return repository.save(closures);
	}

	async findByAncestorAndDescendant(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity | null> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.findOne({
			where: { ancestorId, descendantId },
		});
	}

	async findAncestorsOf(descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity[]> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.find({
			where: { descendantId },
			order: { depth: "ASC" },
		});
	}

	async findDescendantsOf(ancestorId: string, entityManager?: EntityManager): Promise<ClosureEntity[]> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.find({
			where: { ancestorId },
			order: { depth: "ASC" },
		});
	}

	async findAncestorsWithMinDepth(
		descendantId: string,
		minDepth: number = 1,
		entityManager?: EntityManager
	): Promise<Array<{ ancestorId: string; depth: number }>> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;

		const result = await repository
			.createQueryBuilder("c")
			.select(["c.ancestorId", "MIN(c.depth) as depth"])
			.where("c.descendantId = :descendantId", { descendantId })
			.andWhere("c.depth >= :minDepth", { minDepth })
			.groupBy("c.ancestorId")
			.orderBy("depth", "ASC")
			.getRawMany();

		return result.map(row => ({
			ancestorId: row.c_ancestorId,
			depth: parseInt(row.depth),
		}));
	}

	async findDescendantsWithMinDepth(
		ancestorId: string,
		minDepth: number = 1,
		entityManager?: EntityManager
	): Promise<Array<{ descendantId: string; depth: number }>> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;

		const result = await repository
			.createQueryBuilder("c")
			.select(["c.descendantId", "MIN(c.depth) as depth"])
			.where("c.ancestorId = :ancestorId", { ancestorId })
			.andWhere("c.depth >= :minDepth", { minDepth })
			.groupBy("c.descendantId")
			.orderBy("depth", "ASC")
			.getRawMany();

		return result.map(row => ({
			descendantId: row.c_descendantId,
			depth: parseInt(row.depth),
		}));
	}

	async hasPath(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<boolean> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		const count = await repository.count({
			where: { ancestorId, descendantId },
		});
		return count > 0;
	}

	async update(ancestorId: string, descendantId: string, updateData: Partial<ClosureEntity>, entityManager?: EntityManager): Promise<void> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		await repository.update({ ancestorId, descendantId }, updateData);
	}

	async delete(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<void> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		await repository.delete({ ancestorId, descendantId });
	}
}
