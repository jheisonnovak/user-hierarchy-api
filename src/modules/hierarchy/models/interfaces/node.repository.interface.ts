import { NodeEntity } from "../entities/node.entity";

export interface INodeRepository {
	create(nodeData: Partial<NodeEntity>): Promise<NodeEntity>;
	existsByEmail(email: string): Promise<boolean>;
}
