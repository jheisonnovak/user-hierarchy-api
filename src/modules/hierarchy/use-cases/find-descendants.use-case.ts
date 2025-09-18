import { Inject, Injectable } from "@nestjs/common";
import { ListHierarchyDto } from "../models/dtos/list.dto";
import { INodeRepository } from "../models/interfaces/node.repository.interface";
import { FindAndValidateNodeUseCase } from "./find-and-validate-node.use-case";

@Injectable()
export class FindDescendantsUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository,
		private readonly findAndValidateNodeUseCase: FindAndValidateNodeUseCase
	) {}

	async execute(id: string): Promise<ListHierarchyDto[]> {
		await this.findAndValidateNodeUseCase.execute(id);
		const descendants = await this.nodeRepository.findDescendantsById(id);
		return descendants.map(descendant => new ListHierarchyDto(descendant.id, descendant.name, descendant.depth));
	}
}
