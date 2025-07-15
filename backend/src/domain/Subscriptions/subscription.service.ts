import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { DataSource, Repository } from 'typeorm';
import { ChangePlanDto, ResponseSubscriptionDto } from './subscription.schema';
import { plainToInstance } from 'class-transformer';
import { addMonths } from 'date-fns';
import { UserService } from '../User/user.service';
import { Role } from '../User/role.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async findMySubscription(id: number): Promise<ResponseSubscriptionDto[]> {
    const subscriptions = await this.subscriptionRepository.find({
      where: { user_id: id },
      relations: ['user', 'plan'],
    });
    if (!subscriptions || subscriptions.length === 0) {
      throw new HttpException('No entries found for this user', 404);
    }
    return plainToInstance(ResponseSubscriptionDto, subscriptions, {
      excludeExtraneousValues: true,
    });
  }

  async createSubscription(
    userId: number,
    changePlanDto: ChangePlanDto,
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

      const subscription = this.subscriptionRepository.create({
        user_id: userId,
        plan_id: changePlanDto.plan_id,
        automatic_renewal: changePlanDto.automatic_renewal,
        next_payment_date: addMonths(new Date(), 1),
        start_date: new Date(),
        status: SubscriptionStatus.ACTIVE,
      });
      const newSubscription = await queryRunner.manager.save(subscription);

      await this.userService.updateUser(
        userId,
        { role: Role.Socio },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      const subscriptionCreated = await this.subscriptionRepository.findOne({
        where: { id: newSubscription.id },
        relations: ['user', 'plan'],
      });

      if (!subscriptionCreated) {
        throw new HttpException('Subscription not found after creation', 404);
      }
      return plainToInstance(ResponseSubscriptionDto, subscriptionCreated, {
        excludeExtraneousValues: true,
      });
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

      const fullSubscription = await this.subscriptionRepository.findOne({
        where: { id: updatedSubscription.id },
        relations: ['user', 'plan'],
      });
      if (!fullSubscription) {
        throw new HttpException('Subscription not found after update', 404);
      }

      return plainToInstance(ResponseSubscriptionDto, fullSubscription, {
        excludeExtraneousValues: true,
      });
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
    const fullSubscription = await this.subscriptionRepository.findOne({
      where: { id: updatedSubscription.id },
      relations: ['user', 'plan'],
    });
    if (!fullSubscription) {
      throw new HttpException('Subscription not found after cancellation', 404);
    }
    return plainToInstance(ResponseSubscriptionDto, fullSubscription, {
      excludeExtraneousValues: true,
    });
  }
}
