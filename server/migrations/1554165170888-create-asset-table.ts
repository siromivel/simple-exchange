import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssetTable1554165170888 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE asset (
          id serial PRIMARY KEY NOT NULL,
          name text NOT NULL,
          symbol text UNIQUE NOT NULL
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE asset`,
    )
  }
}
