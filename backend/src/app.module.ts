import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeormConfigFactory from './infraestructure/typeOrmConfig';
import { PlansModule } from './domain/Plans/plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfigFactory],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeormConfig = configService.get<Record<string, any>>('typeorm');
        if (!typeormConfig) {
          throw new Error(
            'TypeORM configuration is not defined under key "typeorm"',
          );
        }
        return typeormConfig;
      },
    }),
    PlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
