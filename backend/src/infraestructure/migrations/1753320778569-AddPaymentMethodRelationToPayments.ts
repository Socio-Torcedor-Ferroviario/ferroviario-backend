import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddPaymentMethodRelationToPayments1753320778569
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'payment_method_id',
        type: 'int',
        isNullable: true, // Permite nulo para pagamentos avulsos
      }),
    );

    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['payment_method_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'payment_methods',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');
    if (!table) return;
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('payment_method_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('payments', foreignKey);
    }
    await queryRunner.dropColumn('payments', 'payment_method_id');
  }
}
