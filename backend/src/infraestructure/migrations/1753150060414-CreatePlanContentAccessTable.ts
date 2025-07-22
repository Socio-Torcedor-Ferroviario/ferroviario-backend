import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePlanContentAccessTable1753150060414
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plan_content_access',
        columns: [
          {
            name: 'plan_id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'content_id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'plan_content_access',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'plan_content_access',
      new TableForeignKey({
        columnNames: ['content_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'content',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('plan_content_access');
    if (!table) return;
    const foreignKeyPlan = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('plan_id') !== -1,
    );
    if (foreignKeyPlan) {
      await queryRunner.dropForeignKey('plan_content_access', foreignKeyPlan);
    }

    const foreignKeyContent = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('content_id') !== -1,
    );
    if (foreignKeyContent) {
      await queryRunner.dropForeignKey(
        'plan_content_access',
        foreignKeyContent,
      );
    }

    await queryRunner.dropTable('plan_content_access');
  }
}
