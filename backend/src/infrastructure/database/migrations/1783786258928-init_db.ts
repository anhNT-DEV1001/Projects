import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1783786258928 implements MigrationInterface {
  name = 'InitDb1783786258928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" integer, "username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "full_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "avatar" character varying(255), "phone" character varying(255), "gender" character varying(50), "address" character varying(255), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_phone_active" ON "users"  ("phone") WHERE "deleted_at" IS NULL AND "phone" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_email_active" ON "users"  ("email") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_username_active" ON "users"  ("username") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."uq_users_username_active"`);
    await queryRunner.query(`DROP INDEX "public"."uq_users_email_active"`);
    await queryRunner.query(`DROP INDEX "public"."uq_users_phone_active"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
