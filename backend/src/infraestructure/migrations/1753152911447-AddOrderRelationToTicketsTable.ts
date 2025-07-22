import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddOrderRelationToTicketsTable1753152911447
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tickets',
      new TableColumn({
        name: 'ticket_order_id',
        type: 'int',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['ticket_order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ticket_orders',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tickets');
    if (!table) return;
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('ticket_order_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('tickets', foreignKey);
    }

    await queryRunner.dropColumn('tickets', 'ticket_order_id');
  }
}
