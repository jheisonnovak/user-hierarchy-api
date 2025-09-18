import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClosureEntity } from "./models/entities/closure.entity";
import { NodeEntity } from "./models/entities/node.entity";
import { ClosureTypeOrmRepository } from "./repositories/closure.repository";
import { NodeTypeOrmRepository } from "./repositories/node.repository";
import { CreateClosureSelfLinkUseCase } from "./use-cases/create-closure-self-link.use-case";
import { CreateNodeUseCase } from "./use-cases/create-node.use-case";
import { CreateRelationshipUseCase } from "./use-cases/create-relationship.use-case";
import { FindAndValidateNodeUseCase } from "./use-cases/find-and-validate-node.use-case";
import { ValidateEmailUniquenessUseCase } from "./use-cases/validate-email-uniqueness.use-case";

@Module({
	imports: [TypeOrmModule.forFeature([NodeEntity, ClosureEntity])],
	providers: [
		NodeTypeOrmRepository,
		{
			provide: "INodeRepository",
			useExisting: NodeTypeOrmRepository,
		},
		ClosureTypeOrmRepository,
		{
			provide: "IClosureRepository",
			useExisting: ClosureTypeOrmRepository,
		},
		CreateNodeUseCase,
		CreateClosureSelfLinkUseCase,
		ValidateEmailUniquenessUseCase,
		CreateRelationshipUseCase,
		FindAndValidateNodeUseCase,
	],
	exports: [
		TypeOrmModule,
		CreateNodeUseCase,
		CreateClosureSelfLinkUseCase,
		ValidateEmailUniquenessUseCase,
		CreateRelationshipUseCase,
		FindAndValidateNodeUseCase,
	],
})
export class HierarchyModule {}
