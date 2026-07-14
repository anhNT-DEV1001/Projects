import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUserToken1783797032981 implements MigrationInterface {
  name = 'InitUserToken1783797032981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "user_id" bigint NOT NULL, "ip" character varying(20) NOT NULL, "agent" character varying(255) NOT NULL, "session_id" uuid NOT NULL, "token" character varying(255), "expires_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_tokens_user_id" ON "user_tokens"  ("user_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_tokens_session_id" ON "user_tokens"  ("session_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_tokens_session_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_tokens_user_id"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
  }
}
