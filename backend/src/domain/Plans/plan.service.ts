import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from './plans.entity';
import { Repository } from 'typeorm';
import { CreatePlanDto, ResponsePlanDto } from './plan.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plans) private readonly planRepository: Repository<Plans>,
  ) {}

  async create(plan: CreatePlanDto): Promise<ResponsePlanDto> {
    const newPlanEntity = this.planRepository.create(plan);
    const savedPlan = await this.planRepository.save(newPlanEntity);
    return plainToInstance(ResponsePlanDto, savedPlan);
  }

  async findAll(): Promise<ResponsePlanDto[]> {
    const plans = await this.planRepository.find();
    return plans.map((plan) => plainToInstance(ResponsePlanDto, plan));
  }

  async findOne(id: number): Promise<ResponsePlanDto> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plainToInstance(ResponsePlanDto, plan);
  }

  async remove(id: number): Promise<void> {
    await this.planRepository.delete(id);
  }

  async update(
    id: number,
    plan: CreatePlanDto,
  ): Promise<ResponsePlanDto | null> {
    const existingPlan = await this.planRepository.findOne({ where: { id } });
    if (!existingPlan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    await this.planRepository.update(id, plan);
    const updatedPlan = await this.planRepository.findOne({ where: { id } });
    return plainToInstance(ResponsePlanDto, updatedPlan);
  }
}
