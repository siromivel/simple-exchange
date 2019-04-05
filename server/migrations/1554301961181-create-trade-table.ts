import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTradeTable1554301961181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE trade (
          id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
          type text NOT NULL,
          quantity decimal NOT NULL CHECK (quantity > 0),
          price decimal NOT NULL CHECK (price > 0),
          trading_pair_id integer NOT NULL REFERENCES trading_pair,
          exchange_user_id integer NOT NULL REFERENCES exchange_user,
          executed timestamp NOT NULL DEFAULT now()
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE trade`,
    )
  }
}
