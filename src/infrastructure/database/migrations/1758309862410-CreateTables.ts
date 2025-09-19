import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1758309862410 implements MigrationInterface {
	name = "CreateTables1758309862410";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "nodes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5e74781a18fe7b45124014c38f6" UNIQUE ("email"), CONSTRAINT "PK_682d6427523a0fa43d062ea03ee" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f45a8bf98c0e58c5255b309824" ON "nodes" ("email") WHERE email IS NOT NULL`);
		await queryRunner.query(
			`CREATE TABLE "closure" ("ancestor_id" uuid NOT NULL, "descendant_id" uuid NOT NULL, "depth" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a04fd138f805487b420c9bf09a2" PRIMARY KEY ("ancestor_id", "descendant_id"))`
		);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a04fd138f805487b420c9bf09a" ON "closure" ("ancestor_id", "descendant_id") `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."IDX_a04fd138f805487b420c9bf09a"`);
		await queryRunner.query(`DROP TABLE "closure"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_f45a8bf98c0e58c5255b309824"`);
		await queryRunner.query(`DROP TABLE "nodes"`);
	}
}
