// src/domain/Payments/payments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payments.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Users } from '../User/user.entity';
import { Subscription } from '../Subscriptions/subscription.entity';
import { PaymentMethod } from '../PaymentMethods/payment-methods.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Users, Subscription, PaymentMethod]),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
