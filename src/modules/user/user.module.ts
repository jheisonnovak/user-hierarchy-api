import { Module } from "@nestjs/common";
import { HierarchyModule } from "../hierarchy/hierarchy.module";
import { UserController } from "./controllers/user.controller";
import { CreateUserUseCase } from "./use-cases/create.use-case";

@Module({
	imports: [HierarchyModule],
	providers: [CreateUserUseCase],
	controllers: [UserController],
})
export class UserModule {}
