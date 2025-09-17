import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("closure")
@Index(["ancestorId", "descendantId"], { unique: true })
export class ClosureEntity {
	@PrimaryColumn({ name: "ancestor_id" })
	ancestorId: string;

	@PrimaryColumn({ name: "descendant_id" })
	descendantId: string;

	@Column({ type: "int", default: 0 })
	depth: number;

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;

	constructor(partial: Partial<ClosureEntity>) {
		Object.assign(this, partial);
	}
}
