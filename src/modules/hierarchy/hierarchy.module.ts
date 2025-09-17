import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClosureEntity } from "./models/entities/closure.entity";
import { NodeEntity } from "./models/entities/node.entity";
import { NodeTypeOrmRepository } from "./repositories/node.repository";
import { NodeService } from "./services/node.service";
import { CreateNodeUseCase } from "./use-cases/create-node.use-case";

@Module({
	imports: [TypeOrmModule.forFeature([NodeEntity, ClosureEntity])],
	providers: [
		NodeTypeOrmRepository,
		{
			provide: "INodeRepository",
			useExisting: NodeTypeOrmRepository,
		},
		CreateNodeUseCase,
		NodeService,
	],
	exports: [TypeOrmModule, CreateNodeUseCase, NodeService],
})
export class HierarchyModule {}
