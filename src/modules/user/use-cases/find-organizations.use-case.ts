import { Inject, Injectable } from "@nestjs/common";
import { ListHierarchyDto } from "../../hierarchy/models/dtos/list.dto";
import { NodeType } from "../../hierarchy/models/enums/node-type.enum";
import { INodeRepository } from "../../hierarchy/models/interfaces/node.repository.interface";
import { FindAndValidateNodeUseCase } from "../../hierarchy/use-cases/find-and-validate-node.use-case";

@Injectable()
export class FindOrganizationsUseCase {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository,
		private readonly findAndValidateNodeUseCase: FindAndValidateNodeUseCase
	) {}

	async execute(userId: string): Promise<ListHierarchyDto[]> {
		const user = await this.findAndValidateNodeUseCase.execute(userId, NodeType.USER);
		const groups = await this.nodeRepository.findAncestorsByIdAndType(user.id, NodeType.GROUP);
		return groups.map(group => new ListHierarchyDto(group.id, group.name, group.depth));
	}
}
