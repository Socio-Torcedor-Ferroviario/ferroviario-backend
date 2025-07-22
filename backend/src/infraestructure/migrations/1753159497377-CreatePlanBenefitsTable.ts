import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePlanBenefitsTable1753159497377
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plan_benefits',
        columns: [
          { name: 'plan_id', type: 'int', isPrimary: true },
          { name: 'benefit_id', type: 'int', isPrimary: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'plan_benefits',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'plan_benefits',
      new TableForeignKey({
        columnNames: ['benefit_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'benefits',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('plan_benefits');
  }
}
