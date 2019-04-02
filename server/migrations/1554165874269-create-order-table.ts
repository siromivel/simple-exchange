import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1554165874269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "order" (
          id serial PRIMARY KEY NOT NULL,
          side text NOT NULL,
          open bool NOT NULL DEFAULT true,
          quantity decimal NOT NULL,
          filled decimal NOT NULL DEFAULT 0,
          asset_id integer NOT NULL REFERENCES asset,
          user_id integer NOT NULL REFERENCES exchange_user
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE "order"`,
    )
  }
}
