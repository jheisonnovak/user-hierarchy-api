import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { ListHierarchyDto } from "../models/dtos/list.dto";
import { FindAncestorsUseCase } from "../use-cases/find-ancestors.use-case";
import { FindDescendantsUseCase } from "../use-cases/find-descendants.use-case";

@Controller("nodes")
export class NodeController {
	constructor(
		private readonly findAncestorsUseCase: FindAncestorsUseCase,
		private readonly findDescendantsUseCase: FindDescendantsUseCase
	) {}

	@Get(":id/ancestors")
	async getAncestors(@Param("id", ParseUUIDPipe) id: string): Promise<ListHierarchyDto[]> {
		return this.findAncestorsUseCase.execute(id);
	}

	@Get(":id/descendants")
	async getDescendants(@Param("id", ParseUUIDPipe) id: string): Promise<ListHierarchyDto[]> {
		return this.findDescendantsUseCase.execute(id);
	}
}
