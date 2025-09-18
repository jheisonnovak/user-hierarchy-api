import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity("closure")
@Index(["ancestorId", "descendantId"], { unique: true })
export class ClosureEntity {
	@PrimaryColumn({ name: "ancestor_id", type: "uuid" })
	ancestorId: string;

	@PrimaryColumn({ name: "descendant_id", type: "uuid" })
	descendantId: string;

	@Column({ type: "int", default: 0 })
	depth: number;

	constructor(partial: Partial<ClosureEntity>) {
		Object.assign(this, partial);
	}
}
