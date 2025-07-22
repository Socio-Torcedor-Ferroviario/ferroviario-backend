import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class MakePaymentsPolymorphic1753151700512
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');
    if (!table) return;
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('subscription_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('payments', foreignKey);
    }

    await queryRunner.renameColumn('payments', 'subscription_id', 'payable_id');

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'payable_type',
        type: 'varchar',
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'user_id',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `UPDATE "payments" SET "payable_type" = 'SUBSCRIPTION' WHERE "payable_type" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');
    if (!table) return;
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    if (userForeignKey) {
      await queryRunner.dropForeignKey('payments', userForeignKey);
    }
    await queryRunner.dropColumn('payments', 'user_id');

    await queryRunner.dropColumn('payments', 'payable_type');
    await queryRunner.renameColumn('payments', 'payable_id', 'subscription_id');
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['subscription_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'subscriptions',
        onDelete: 'CASCADE',
      }),
    );
  }
}
