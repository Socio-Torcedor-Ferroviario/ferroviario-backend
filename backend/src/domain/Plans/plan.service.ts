import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plans } from './plans.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plans) private readonly planRepository: Repository<Plans>,
  ) {}

  async create(plan: Partial<Plans>): Promise<Plans> {
    const newPlan = this.planRepository.create(plan);
    return await this.planRepository.save(newPlan);
  }

  async findAll(): Promise<Plans[]> {
    return await this.planRepository.find();
  }

  async findOne(id: number): Promise<Plans | null> {
    return await this.planRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.planRepository.delete(id);
  }

  async update(id: number, plan: Partial<Plans>): Promise<Plans | null> {
    await this.planRepository.update(id, plan);
    return this.findOne(id);
  }
}
