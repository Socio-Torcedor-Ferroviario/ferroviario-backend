import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { DataSource, Repository } from 'typeorm';
import {
  ChangePlanDto,
  CreateSubscriptionDto,
  ResponseSubscriptionDto,
} from './subscription.schema';
import { plainToInstance } from 'class-transformer';
import { addMonths } from 'date-fns';
import { UserService } from '../User/user.service';
import { Role } from '../User/role.enum';
import { PaymentsService } from '../Payments/payments.service';
import { Plans } from '../Plans/plans.entity';
import { PayableType } from '../Payments/payments.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly userService: UserService,
    @InjectRepository(Plans)
    private readonly planRepository: Repository<Plans>,
    private readonly paymentService: PaymentsService,
    private readonly dataSource: DataSource,
  ) {}

  private async findAndFormatSubscription(
    id: number,
  ): Promise<ResponseSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: [
        'user',
        'plan',
        'plan.planBenefits',
        'plan.planBenefits.benefit', // Carrega a relação aninhada
      ],
    });

    if (!subscription) {
      throw new HttpException('Subscription not found after operation', 404);
    }

    const benefits = subscription.plan.planBenefits.map((pb) => pb.benefit);

    const formattedSubscription = {
      ...subscription,
      plan: {
        ...subscription.plan,
        benefits: benefits,
      },
    };

    return plainToInstance(ResponseSubscriptionDto, formattedSubscription, {
      excludeExtraneousValues: true,
    });
  }

  async findMySubscription(id: number): Promise<ResponseSubscriptionDto[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { user_id: id },
      relations: [
        'user',
        'plan',
        'plan.planBenefits',
        'plan.planBenefits.benefit',
      ],
    });
    if (!subscriptions || subscriptions.length === 0) {
      throw new HttpException('No entries found for this user', 404);
    }
    const subscriptionsWithBenefits = subscriptions.map((sub) => {
      const benefits = sub.plan.planBenefits.map((pb) => pb.benefit);
      return {
        ...sub,
        plan: {
          ...sub.plan,
          benefits: benefits,
        },
      };
    });

    return plainToInstance(ResponseSubscriptionDto, subscriptionsWithBenefits, {
      excludeExtraneousValues: true,
    });
  }

  async createSubscription(
    userId: number,
    subscriptionDto: CreateSubscriptionDto,
  ): Promise<ResponseSubscriptionDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingSubscription = await queryRunner.manager.findOne(
        Subscription,
        {
          where: { user_id: userId, status: SubscriptionStatus.ACTIVE },
        },
      );

      if (existingSubscription) {
        throw new HttpException('User already has an active subscription', 400);
      }

      const plan = await this.planRepository.findOneBy({
        id: subscriptionDto.plan_id,
      });
      if (!plan) {
        throw new NotFoundException(
          `Plan with ID ${subscriptionDto.plan_id} not found`,
        );
      }

      const subscription = this.subscriptionRepository.create({
        user_id: userId,
        plan_id: subscriptionDto.plan_id,
        automatic_renewal: subscriptionDto.automatic_renewal,
        next_payment_date: addMonths(new Date(), 1),
        start_date: new Date(),
        status: SubscriptionStatus.PENDING_PAYMENT,
      });
      const newSubscription = await queryRunner.manager.save(subscription);

      await this.paymentService.createPayment(
        {
          userId,
          amount: plan.price,
          payableId: newSubscription.id,
          payableType: PayableType.SUBSCRIPTION,
          paymentMethodDescription: `Payment Method ID: ${subscriptionDto.paymentMethodId}`,
          status: 'PAID',
          paymentDate: new Date(),
        },
        queryRunner.manager,
      );

      newSubscription.status = SubscriptionStatus.ACTIVE;
      await queryRunner.manager.save(newSubscription);

      await this.userService.updateUser(
        userId,
        { role: Role.Socio },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return this.findAndFormatSubscription(newSubscription.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async changePlan(
    userId: number,
    changePlanDto: ChangePlanDto,
  ): Promise<ResponseSubscriptionDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const existingSubscription = await queryRunner.manager.findOne(
      Subscription,
      {
        where: { user_id: userId, status: SubscriptionStatus.ACTIVE },
      },
    );

    if (!existingSubscription) {
      throw new HttpException(
        'No active subscription found for this user',
        404,
      );
    }
    if (changePlanDto.plan_id === existingSubscription.plan_id) {
      throw new HttpException('You are already subscribed to this plan', 400);
    }
    existingSubscription.plan_id = changePlanDto.plan_id;
    existingSubscription.automatic_renewal = changePlanDto.automatic_renewal;

    try {
      const updatedSubscription =
        await queryRunner.manager.save(existingSubscription);

      if (!updatedSubscription) {
        throw new HttpException('Subscription update failed', 500);
      }

      await queryRunner.commitTransaction();

      return this.findAndFormatSubscription(updatedSubscription.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelSubscription(userId: number): Promise<ResponseSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user_id: userId, status: SubscriptionStatus.ACTIVE },
    });
    if (!subscription) {
      throw new HttpException(
        'No active subscription found for this user',
        404,
      );
    }
    subscription.automatic_renewal = false;
    subscription.next_payment_date = undefined;
    subscription.end_date = new Date();

    subscription.status = SubscriptionStatus.INACTIVE;
    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);

    if (!updatedSubscription) {
      throw new HttpException('Subscription cancellation failed', 500);
    }
    return this.findAndFormatSubscription(updatedSubscription.id);
  }
}
