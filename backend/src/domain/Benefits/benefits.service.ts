import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Benefit } from './benefits.entity';
import { Repository } from 'typeorm';
import { CreateBenefitDto, UpdateBenefitDto } from './benefits.schema';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(Benefit)
    private readonly benefitRepository: Repository<Benefit>,
  ) {}

  async create(createBenefitDto: CreateBenefitDto): Promise<Benefit> {
    const benefit = this.benefitRepository.create(createBenefitDto);
    return this.benefitRepository.save(benefit);
  }

  async findAll(): Promise<Benefit[]> {
    return this.benefitRepository.find();
  }

  async findOne(id: number): Promise<Benefit> {
    const benefit = await this.benefitRepository.findOneBy({ id });
    if (!benefit) {
      throw new NotFoundException(`Benefit with ID ${id} not found.`);
    }
    return benefit;
  }

  async update(
    id: number,
    updateBenefitDto: UpdateBenefitDto,
  ): Promise<Benefit> {
    const benefit = await this.findOne(id);
    Object.assign(benefit, updateBenefitDto);
    return this.benefitRepository.save(benefit);
  }

  async remove(id: number): Promise<void> {
    const result = await this.benefitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Benefit with ID ${id} not found.`);
    }
  }
}
