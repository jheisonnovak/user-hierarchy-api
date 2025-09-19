import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeController } from "./controllers/node.controller";
import { ClosureEntity } from "./models/entities/closure.entity";
import { NodeEntity } from "./models/entities/node.entity";
import { ClosureTypeOrmRepository } from "./repositories/closure.repository";
import { NodeTypeOrmRepository } from "./repositories/node.repository";
import { CreateNodeWithSelfLinkUseCase } from "./use-cases/create-node-with-self-link/create-node-with-self-link.use-case";
import { CreateRelationshipUseCase } from "./use-cases/create-relationship/create-relationship.use-case";
import { FindAncestorsUseCase } from "./use-cases/find-ancestors/find-ancestors.use-case";
import { FindAndValidateNodeUseCase } from "./use-cases/find-and-validate-node/find-and-validate-node.use-case";
import { FindDescendantsUseCase } from "./use-cases/find-descendants/find-descendants.use-case";
import { ValidateEmailUniquenessUseCase } from "./use-cases/validate-email-uniqueness/validate-email-uniqueness.use-case";

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
		CreateNodeWithSelfLinkUseCase,
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
		CreateNodeWithSelfLinkUseCase,
		ValidateEmailUniquenessUseCase,
		CreateRelationshipUseCase,
		FindAndValidateNodeUseCase,
	],
})
export class HierarchyModule {}
