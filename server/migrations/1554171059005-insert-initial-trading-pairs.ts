import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInitialTradingPairs1554171059005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `WITH us_dollar AS (SELECT id FROM asset WHERE symbol = 'USD'),

            bitcoin AS (SELECT id FROM asset WHERE symbol = 'BTC')

            INSERT INTO trading_pair (base_currency_id, to_currency_id)
                VALUES ((SELECT id FROM us_dollar), (SELECT id FROM bitcoin))`
        )

        await queryRunner.query(
            `WITH bitcoin AS (SELECT id FROM asset WHERE symbol = 'BTC'),

            dogecoin AS (SELECT id FROM asset WHERE symbol = 'DOGE')

            INSERT INTO trading_pair (base_currency_id, to_currency_id)
                VALUES ((SELECT id FROM bitcoin), (SELECT id FROM dogecoin))`
        )

        await queryRunner.query(
            `WITH bitcoin AS (SELECT id FROM asset WHERE symbol = 'BTC'),

            litecoin AS (SELECT id FROM asset WHERE symbol = 'LTC')

            INSERT INTO trading_pair (base_currency_id, to_currency_id)
                VALUES ((SELECT id FROM bitcoin), (SELECT id FROM litecoin))`
        )

        await queryRunner.query(
            `WITH bitcoin AS (SELECT id FROM asset WHERE symbol = 'BTC'),

            monero AS (SELECT id FROM asset WHERE symbol = 'XMR')

            INSERT INTO trading_pair (base_currency_id, to_currency_id)
                VALUES ((SELECT id FROM bitcoin), (SELECT id FROM monero))`
        )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM trading_pair`,
    )
  }
}
