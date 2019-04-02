import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatePairTable1554170877809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "trading_pair" (
          id serial PRIMARY KEY NOT NULL,
          base_currency_id integer NOT NULL REFERENCES asset,
          to_currency_id integer NOT NULL REFERENCES asset,
          UNIQUE (base_currency_id, to_currency_id)
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE "trading_pair"`,
    )
  }
}
