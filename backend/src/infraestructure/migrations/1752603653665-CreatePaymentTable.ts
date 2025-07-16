import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePaymentTable1752603653665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'subscription_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'payment_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payment_method_description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payment_gateway_id',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Chave estrangeira para payments -> subscriptions
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment');
  }
}
