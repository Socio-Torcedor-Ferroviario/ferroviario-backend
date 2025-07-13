import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSubscriptionsTable1752373786460
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
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
            name: 'plan_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'next_payment_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            default: "'INACTIVE'",
            enum: ['ACTIVE', 'INACTIVE', 'PENDING_PAYMENT'],
            enumName: 'subscriptions_status_enum',
            isNullable: false,
          },
          {
            name: 'automatic_renewal',
            type: 'boolean',
            default: true,
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
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['plan_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'plans',
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscriptions');
  }
}
