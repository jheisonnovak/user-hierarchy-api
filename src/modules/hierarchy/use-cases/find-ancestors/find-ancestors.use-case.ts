import { Inject, Injectable } from "@nestjs/common";
import { ListHierarchyDto } from "../../models/dtos/list.dto";
import { INodeRepository } from "../../models/interfaces/node.repository.interface";
import { FindAndValidateNodeUseCase } from "../find-and-validate-node/find-and-validate-node.use-case";

@Injectable()
export class FindAncestorsUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository,
		private readonly findAndValidateNodeUseCase: FindAndValidateNodeUseCase
	) {}

	async execute(id: string): Promise<ListHierarchyDto[]> {
		await this.findAndValidateNodeUseCase.execute(id);
		const ancestors = await this.nodeRepository.findAncestorsById(id);
		return ancestors.map(ancestor => new ListHierarchyDto(ancestor.id, ancestor.name, ancestor.depth));
	}
}
