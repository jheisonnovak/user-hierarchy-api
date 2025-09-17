import { Module } from "@nestjs/common";
import { HierarchyModule } from "../hierarchy/hierarchy.module";
import { GroupController } from "./controllers/group.module";
import { CreateGroupUseCase } from "./use-cases/create.use-case";

@Module({
	imports: [HierarchyModule],
	controllers: [GroupController],
	providers: [CreateGroupUseCase],
})
export class GroupModule {}
