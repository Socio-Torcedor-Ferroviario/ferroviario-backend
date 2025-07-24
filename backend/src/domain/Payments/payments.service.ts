import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { Users } from '../User/user.entity';
import {
  CreatePaymentDto,
  PaymentsHistoryDto,
  ResponsePaymentDto,
} from './payments.schema';
import { plainToInstance } from 'class-transformer';
import { PaymentMethod } from '../PaymentMethods/payment-methods.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  private async processGatewayPayment(token?: string): Promise<boolean> {
    if (!token) return false;
    await new Promise((resolve) => setTimeout(resolve, 500));

    return true;
  }

  async createPayment(
    paymentData: CreatePaymentDto,
    manager: EntityManager,
  ): Promise<ResponsePaymentDto> {
    const isPaymentSuccessful = await this.processGatewayPayment(
      paymentData.paymentGatewayId,
    );

    if (!isPaymentSuccessful) {
      throw new Error('Falha no processamento do pagamento.');
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: paymentData.paymentMethodId },
    });

    if (!paymentMethod) {
      throw new Error('Método de pagamento não encontrado.');
    }

    const newPayment = manager.create(Payment, {
      ...paymentData,
      paymentDate: new Date(),
      status: 'PAID',
    });

    const payment = await manager.save(newPayment);

    return plainToInstance(ResponsePaymentDto, payment, {
      excludeExtraneousValues: true,
    });
  }

  async getPaymentHistoryForUser(
    userId: number,
  ): Promise<PaymentsHistoryDto[]> {
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

    return payments.map((payment) =>
      plainToInstance(PaymentsHistoryDto, payment, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
