import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from './plans.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreatePlanDto,
  ResponsePlanDto,
  ResponsePlanDtoWithoutBenefits,
  UpdatePlanDto,
} from './plan.schema';
import { plainToInstance } from 'class-transformer';
import { PlanBenefit } from './plan-benefits.entity';
import { Benefit } from '../Benefits/benefits.entity';
type FormattedPlan = Plans & { benefits: Benefit[] };
@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plans) private readonly planRepository: Repository<Plans>,
    private readonly dataSource: DataSource,
  ) {}

  private formatPlanResponse = (plan: Plans): FormattedPlan | null => {
    if (!plan) return null;

    const benefits = plan.planBenefits
      ? plan.planBenefits.map((pb) => pb.benefit)
      : [];

    return {
      ...plan,
      benefits: benefits,
    };
  };

  async create(plan: CreatePlanDto): Promise<ResponsePlanDtoWithoutBenefits> {
    const newPlanEntity = this.planRepository.create(plan);
    const savedPlan = await this.planRepository.save(newPlanEntity);
    return plainToInstance(ResponsePlanDtoWithoutBenefits, savedPlan, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ResponsePlanDto[]> {
    const plans = await this.planRepository.find({
      relations: ['planBenefits', 'planBenefits.benefit'],
    });
    const formattedPlans = plans.map(this.formatPlanResponse);
    return plainToInstance(ResponsePlanDto, formattedPlans, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<ResponsePlanDto> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['planBenefits', 'planBenefits.benefit'],
    });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    const formattedPlan = this.formatPlanResponse(plan);
    return plainToInstance(ResponsePlanDto, formattedPlan, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number): Promise<void> {
    await this.planRepository.delete(id);
  }

  async update(
    id: number,
    updatePlanDto: UpdatePlanDto,
  ): Promise<ResponsePlanDto> {
    const { benefit_ids, ...planData } = updatePlanDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const plan = await queryRunner.manager.findOneBy(Plans, { id });
      if (!plan) {
        throw new NotFoundException(`Plan with ID ${id} not found.`);
      }

      queryRunner.manager.merge(Plans, plan, planData);
      await queryRunner.manager.save(plan);

      if (benefit_ids !== undefined) {
        await queryRunner.manager.delete(PlanBenefit, { plan_id: id });

        const newPlanBenefits = benefit_ids.map((benefitId) => {
          return queryRunner.manager.create(PlanBenefit, {
            plan_id: id,
            benefit_id: benefitId,
          });
        });
        await queryRunner.manager.save(newPlanBenefits);
      }

      await queryRunner.commitTransaction();

      const updatedPlan = await this.planRepository.findOne({
        where: { id },
        relations: ['planBenefits', 'planBenefits.benefit'],
      });

      const formattedPlan = updatedPlan
        ? this.formatPlanResponse(updatedPlan)
        : null;
      return plainToInstance(ResponsePlanDto, formattedPlan, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
