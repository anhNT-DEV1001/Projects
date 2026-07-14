import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMasterdataTbl1784054211357 implements MigrationInterface {
    name = 'InitMasterdataTbl1784054211357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "master_data" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" integer, "data_key" character varying(200) NOT NULL, "data_value" character varying(500) NOT NULL, "data_value_name" character varying(200) NOT NULL, "data_key_name" character varying(200) NOT NULL, "data_order" integer NOT NULL DEFAULT '0', "data_description" character varying(500), CONSTRAINT "PK_ed55f1736986cf68b330d92bfee" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "master_data"`);
    }

}
