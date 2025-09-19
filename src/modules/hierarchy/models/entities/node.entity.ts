import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { NodeType } from "../enums/node-type.enum";

@Entity("nodes")
export class NodeEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "character varying", enum: NodeType })
	type: NodeType;

	@Column({ length: 255 })
	name: string;

	@Column({ unique: true, nullable: true, length: 255 })
	@Index({ unique: true, where: "email IS NOT NULL" })
	email?: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	constructor(partial?: Partial<NodeEntity>) {
		Object.assign(this, partial);
	}
}
