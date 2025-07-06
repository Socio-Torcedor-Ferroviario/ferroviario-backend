import { config as dotenvConfig } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenvConfig({ path: '.env' });

const isCompiled = __filename.endsWith('.js');

export const getTypeOrmOptions = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  autoLoadEntities: true,
  entities: [isCompiled ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [
    isCompiled
      ? 'dist/infraestructure/migrations/*.js'
      : 'src/infraestructure/migrations/*.ts',
  ],
});
