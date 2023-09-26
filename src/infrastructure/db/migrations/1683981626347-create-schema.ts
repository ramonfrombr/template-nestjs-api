import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetSchema1683981626347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DATABASE_SCHEMA;
    await queryRunner.createSchema(schema, true);
    await queryRunner.query(`SET search_path TO ${schema}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SET search_path TO public');
  }
}
