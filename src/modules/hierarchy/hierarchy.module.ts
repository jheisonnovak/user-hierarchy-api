import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeController } from "./controllers/node.controller";
import { ClosureEntity } from "./models/entities/closure.entity";
import { NodeEntity } from "./models/entities/node.entity";
import { ClosureTypeOrmRepository } from "./repositories/closure.repository";
import { NodeTypeOrmRepository } from "./repositories/node.repository";
import { CreateClosureSelfLinkUseCase } from "./use-cases/create-closure-self-link.use-case";
import { CreateNodeUseCase } from "./use-cases/create-node.use-case";
import { CreateRelationshipUseCase } from "./use-cases/create-relationship.use-case";
import { FindAncestorsUseCase } from "./use-cases/find-ancestors.use-case";
import { FindAndValidateNodeUseCase } from "./use-cases/find-and-validate-node.use-case";
import { FindDescendantsUseCase } from "./use-cases/find-descendants.use-case";
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
		FindAncestorsUseCase,
		FindDescendantsUseCase,
	],
	controllers: [NodeController],
	exports: [
		TypeOrmModule,
		"INodeRepository",
		CreateNodeUseCase,
		CreateClosureSelfLinkUseCase,
		ValidateEmailUniquenessUseCase,
		CreateRelationshipUseCase,
		FindAndValidateNodeUseCase,
	],
})
export class HierarchyModule {}
