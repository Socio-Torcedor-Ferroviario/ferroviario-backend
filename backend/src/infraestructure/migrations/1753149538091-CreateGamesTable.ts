import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGamesTable1753149538091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'games',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'opponent_team',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'championship',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'match_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'home_or_away',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'capacity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'visibility',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'base_ticket_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('games');
  }
}
