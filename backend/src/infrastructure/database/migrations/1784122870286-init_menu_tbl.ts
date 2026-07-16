import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMenuTbl1784122870286 implements MigrationInterface {
    name = 'InitMenuTbl1784122870286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" integer, "title" character varying(100) NOT NULL, "href" character varying(255) NOT NULL, "icon" character varying(255) NOT NULL, "order" integer NOT NULL, "alias" character varying(255) NOT NULL, "parentId" character varying(255), CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "menus"`);
    }

}
