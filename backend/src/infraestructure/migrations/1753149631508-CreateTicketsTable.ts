import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTicketsTable1753149631508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tickets',
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
            name: 'qr_code',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'purchase_date',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'original_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'price_paid',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'tickets',
      new TableForeignKey({
        columnNames: ['game_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'games',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tickets');
    if (!table) return;
    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    const foreignKeyGame = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('game_id') !== -1,
    );

    if (foreignKeyUser) {
      await queryRunner.dropForeignKey('tickets', foreignKeyUser);
    }
    if (foreignKeyGame) {
      await queryRunner.dropForeignKey('tickets', foreignKeyGame);
    }

    await queryRunner.dropTable('tickets');
  }
}
