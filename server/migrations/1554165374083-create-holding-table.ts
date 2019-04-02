import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateHoldingTable1554165374083 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE holding (
          id serial PRIMARY KEY NOT NULL,
          balance decimal NOT NULL DEFAULT 0,
          currency_id integer NOT NULL REFERENCES asset,
          user_id integer NOT NULL REFERENCES exchange_user
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE holding`,
    )
  }
}
