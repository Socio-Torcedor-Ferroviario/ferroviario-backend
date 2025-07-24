import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plans } from './plans.entity';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Plans])],
  providers: [PlanService],
  controllers: [PlanController],
  exports: [TypeOrmModule, PlanService],
})
export class PlansModule {}
