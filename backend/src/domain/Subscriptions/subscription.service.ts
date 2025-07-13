import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { Repository } from 'typeorm';
import { ChangePlanDto, ResponseSubscriptionDto } from './subscription.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findMySubscription(id: number): Promise<ResponseSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user_id: id },
      relations: ['user', 'plan'],
    });
    if (!subscription) {
      throw new Error('No entries found for this user');
    }
    return plainToInstance(ResponseSubscriptionDto, subscription, {
      excludeExtraneousValues: true,
    });
  }

  async createSubscription(
    userId: number,
    changePlanDto: ChangePlanDto,
  ): Promise<ResponseSubscriptionDto> {
    const subscription = this.subscriptionRepository.create({
      user_id: userId,
      plan_id: changePlanDto.plan_id,
      automatic_renewal: changePlanDto.automatic_renewal,
      start_date: new Date(),
      status: SubscriptionStatus.ACTIVE,
    });
    const savedSubscription =
      await this.subscriptionRepository.save(subscription);
    return plainToInstance(ResponseSubscriptionDto, savedSubscription, {
      excludeExtraneousValues: true,
    });
  }

  async changePlan(
    userId: number,
    changePlanDto: ChangePlanDto,
  ): Promise<ResponseSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user_id: userId },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new Error('No subscription found for this user');
    }

    subscription.plan_id = changePlanDto.plan_id;
    subscription.automatic_renewal = changePlanDto.automatic_renewal;

    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);

    return plainToInstance(ResponseSubscriptionDto, updatedSubscription, {
      excludeExtraneousValues: true,
    });
  }

  async cancelSubscription(id: number): Promise<ResponseSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { user_id: id },
      relations: ['user', 'plan'],
    });
    if (!subscription) {
      throw new Error('No subscription found for this user');
    }
    subscription.status = SubscriptionStatus.INACTIVE;
    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);
    return plainToInstance(ResponseSubscriptionDto, updatedSubscription, {
      excludeExtraneousValues: true,
    });
  }
}
