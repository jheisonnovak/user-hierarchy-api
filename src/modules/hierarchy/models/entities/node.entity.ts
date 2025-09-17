import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NodeType } from "../enums/node-type.enum";

@Entity("nodes")
export class NodeEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "enum", enum: NodeType })
	type: NodeType;

	@Column({ length: 255 })
	name: string;

	@Column({ unique: true, nullable: true, length: 255 })
	@Index({ unique: true, where: "email IS NOT NULL" })
	email?: string;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt: Date;

	constructor(partial?: Partial<NodeEntity>) {
		Object.assign(this, partial);
	}
}
