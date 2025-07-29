import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeormConfigFactory from './infraestructure/typeOrmConfig';
import { PlansModule } from './domain/Plans/plans.module';
import { UserModule } from './domain/User/user.module';
import { AuthModule } from './domain/Auth/auth.module';
import { SubscriptionModule } from './domain/Subscriptions/subscription.module';
import { PaymentsModule } from './domain/Payments/payments.module';
import { PaymentMethodsModule } from './domain/PaymentMethods/payment-methods.module';
import { PartnerModule } from './domain/Partners/partner.module';
import { ContentModule } from './domain/Content/content.module';
import { GamesModule } from './domain/Games/game.module';
import { TicketModule } from './domain/Tickets/ticket.module';
import { TicketOrdersModule } from './domain/TicketOrders/ticket-orders.module';
import { BenefitsModule } from './domain/Benefits/benefits.module';
import { DashboardModule } from './domain/Dashboard/dashboard.module';

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
    UserModule,
    AuthModule,
    PaymentsModule,
    PaymentMethodsModule,
    SubscriptionModule,
    PartnerModule,
    ContentModule,
    GamesModule,
    TicketModule,
    TicketOrdersModule,
    BenefitsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
