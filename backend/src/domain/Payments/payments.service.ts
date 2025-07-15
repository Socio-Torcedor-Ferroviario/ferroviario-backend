// src/domain/Payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { Users } from '../User/user.entity';
import { PaymentHistoryDto } from './payments.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getPaymentHistoryForUser(userId: number): Promise<PaymentHistoryDto[]> {
    const userWithSubscriptions = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.subscriptions', 'subscription')
      .leftJoinAndSelect('subscription.payments', 'payment')
      .where('user.id = :userId', { userId })
      .orderBy('payment.paymentDate', 'DESC')
      .getOne();

    if (!userWithSubscriptions || !userWithSubscriptions.subscriptions) {
      return [];
    }

    const payments: Payment[] = [];
    userWithSubscriptions.subscriptions.forEach((subscription) => {
      if (subscription.payments) {
        payments.push(...subscription.payments);
      }
    });

    return payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      status: payment.status,
      paymentMethodDescription: payment.paymentMethodDescription,
    }));
  }
}
