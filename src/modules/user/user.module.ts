import { Module } from "@nestjs/common";
import { HierarchyModule } from "../hierarchy/hierarchy.module";
import { UserController } from "./controllers/user.controller";
import { CreateAssociationUserUseCase } from "./use-cases/create-association.use-case";
import { CreateUserUseCase } from "./use-cases/create.use-case";
import { FindOrganizationsUseCase } from "./use-cases/find-organizations.use-case";

@Module({
	imports: [HierarchyModule],
	providers: [CreateUserUseCase, CreateAssociationUserUseCase, FindOrganizationsUseCase],
	controllers: [UserController],
})
export class UserModule {}
