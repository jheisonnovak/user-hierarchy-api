import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";

export class ListGroupDto {
	constructor(
		private readonly id: string,
		private readonly type: NodeType,
		private readonly name: string,
		private readonly createdAt: Date
	) {}
}
