import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Users } from '../User/user.entity';
import { Game } from '../Games/game.entity';
import { Plans } from '../Plans/plans.entity';
import { Content } from '../Content/content.entity';
import { Subscription } from '../Subscriptions/subscription.entity';
import { Payment } from '../Payments/payments.entity';
import { PlanBenefit } from '../Plans/plan-benefits.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Game,
      Plans,
      Content,
      Subscription,
      Payment,
      PlanBenefit,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
