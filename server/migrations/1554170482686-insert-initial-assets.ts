import { MigrationInterface, QueryRunner } from 'typeorm'

export class InsertInitialAssets1554170482686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
        `INSERT INTO asset (name, symbol)
            VALUES ('Bitcoin', 'BTC')`
    )
    await queryRunner.query(
        `INSERT INTO asset (name, symbol)
            VALUES ('Dogecoin', 'DOGE')`
    )
    await queryRunner.query(
        `INSERT INTO asset (name, symbol)
            VALUES ('Litecoin', 'LTC')`
    )
    await queryRunner.query(
        `INSERT INTO asset (name, symbol)
            VALUES ('US Dollar', 'USD')`
    )
    await queryRunner.query(
        `INSERT INTO asset (name, symbol)
            VALUES ('Monero', 'XMR')`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM asset
        WHERE symbol = 'BTC'
           OR symbol = 'DOGE'
           OR symbol = 'LTC'
           OR symbol = 'USD'
           OR symbol = 'XMR'`,
    )
  }
}
