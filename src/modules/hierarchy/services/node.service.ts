import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { INodeRepository } from "../models/interfaces/node.repository.interface";

@Injectable()
export class NodeService {
	constructor(
		@Inject("INodeRepository")
		private readonly nodeRepository: INodeRepository
	) {}

	async validateEmailUniqueness(email: string): Promise<void> {
		const emailExists = await this.nodeRepository.existsByEmail(email);
		if (emailExists) throw new ConflictException("Email already in use");
	}
}
