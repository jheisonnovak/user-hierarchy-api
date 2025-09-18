import { NodeType } from "../../../hierarchy/models/enums/node-type.enum";

export class ListUserDto {
	constructor(
		private readonly id: string,
		private readonly type: NodeType,
		private readonly name: string,
		private readonly email: string | undefined,
		private readonly createdAt: Date
	) {}
}
