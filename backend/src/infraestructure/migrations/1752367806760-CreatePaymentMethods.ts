import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentMethods1752367806760 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_methods',
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
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'last_four_digits',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'card_brand',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expiry_date',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_default',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'gateway_token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    /*await queryRunner.createForeignKey(
      'payment_methods',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );*/
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_methods');
  }
}
