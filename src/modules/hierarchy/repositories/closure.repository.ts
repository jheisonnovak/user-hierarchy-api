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
		return repository.create(closureData);
	}

	async findByAncestorAndDescendant(ancestorId: string, descendantId: string, entityManager?: EntityManager): Promise<ClosureEntity | null> {
		const repository = entityManager ? entityManager.getRepository(ClosureEntity) : this.closureRepository;
		return repository.findOne({ where: { ancestorId, descendantId } });
	}
}
