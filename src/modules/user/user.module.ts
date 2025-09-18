import { Module } from "@nestjs/common";
import { HierarchyModule } from "../hierarchy/hierarchy.module";
import { UserController } from "./controllers/user.controller";
import { CreateAssociationUserUseCase } from "./use-cases/create-association.use-case";
import { CreateUserUseCase } from "./use-cases/create.use-case";

@Module({
	imports: [HierarchyModule],
	providers: [CreateUserUseCase, CreateAssociationUserUseCase],
	controllers: [UserController],
})
export class UserModule {}
