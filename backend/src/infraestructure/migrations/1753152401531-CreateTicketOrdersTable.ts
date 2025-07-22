import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTicketOrdersTable1753152401531
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ticket_orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'game_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'ticket_orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ticket_orders',
      new TableForeignKey({
        columnNames: ['game_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'games',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ticket_orders');
    if (!table) return;
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    if (userForeignKey) {
      await queryRunner.dropForeignKey('ticket_orders', userForeignKey);
    }

    const gameForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('game_id') !== -1,
    );
    if (gameForeignKey) {
      await queryRunner.dropForeignKey('ticket_orders', gameForeignKey);
    }

    await queryRunner.dropTable('ticket_orders');
  }
}
