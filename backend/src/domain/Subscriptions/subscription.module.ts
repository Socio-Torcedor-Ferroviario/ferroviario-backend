import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { UserModule } from '../User/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), UserModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
