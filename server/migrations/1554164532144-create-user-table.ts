import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1554164532144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" (
          id serial UNIQUE NOT NULL,
          name text UNIQUE NOT NULL
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DROP TABLE "user"`,
    )
  }
}
