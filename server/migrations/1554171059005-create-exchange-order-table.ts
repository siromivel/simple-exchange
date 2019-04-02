import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrderTable1554171059005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE exchange_order (
          id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
          side text NOT NULL,
          open bool NOT NULL DEFAULT true,
          price decimal NOT NULL,
          quantity decimal NOT NULL,
          filled decimal NOT NULL DEFAULT 0,
          trading_pair_id integer NOT NULL REFERENCES trading_pair,
          exchange_user_id integer NOT NULL REFERENCES exchange_user
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE exchange_order`,
    )
  }
}
