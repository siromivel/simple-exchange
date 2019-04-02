import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFillTable1554171059005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE fill (
          id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
          quantity decimal NOT NULL,
          exchange_order_id uuid NOT NULL REFERENCES exchange_order,
          exchange_user_id integer NOT NULL REFERENCES exchange_user
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE fill`,
    )
  }
}
