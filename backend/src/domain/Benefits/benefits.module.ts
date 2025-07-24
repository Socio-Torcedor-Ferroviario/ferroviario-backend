import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from './benefits.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit])],
  controllers: [BenefitsController],
  providers: [BenefitsService],
  exports: [BenefitsService],
})
export class BenefitsModule {}
