export class ListGroupDto {
	constructor(
		private readonly id: string,
		private readonly name: string,
		private readonly createdAt: Date,
		private readonly updatedAt: Date
	) {}
}
