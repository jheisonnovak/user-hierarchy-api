import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NodeEntity } from "../models/entities/node.entity";
import { INodeRepository } from "../models/interfaces/node.repository.interface";

@Injectable()
export class NodeTypeOrmRepository implements INodeRepository {
	constructor(
		@InjectRepository(NodeEntity)
		private readonly repository: Repository<NodeEntity>
	) {}

	async create(nodeData: Partial<NodeEntity>): Promise<NodeEntity> {
		return await this.repository.save(nodeData);
	}

	async existsByEmail(email: string): Promise<boolean> {
		return this.repository.exists({ where: { email } });
	}
}
