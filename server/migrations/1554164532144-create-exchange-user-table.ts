import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateExchangeUserTable1554164532144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE exchange_user (
          id serial PRIMARY KEY NOT NULL,
          name text UNIQUE NOT NULL
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE exchange_user`,
    )
  }
}
