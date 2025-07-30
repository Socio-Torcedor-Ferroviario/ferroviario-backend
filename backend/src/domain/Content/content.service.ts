import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './content.entity';
import { In, Repository } from 'typeorm';
import {
  CreateContentDto,
  ResponseContentDto,
  UpdateContentDto,
} from './content.schema';
import { plainToInstance } from 'class-transformer';
import { Plans } from '../Plans/plans.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Plans)
    private readonly planRepository: Repository<Plans>,
  ) {}

  async create(
    authorId: number,
    createContentDto: CreateContentDto,
  ): Promise<ResponseContentDto> {
    const { planIds, ...contentData } = createContentDto;

    const content = this.contentRepository.create({
      ...contentData,
      author_id: authorId,
    });
    if (planIds && planIds.length > 0) {
      const plans = await this.planRepository.findBy({ id: In(planIds) });
      content.plans = plans;
    }
    const savedContent = await this.contentRepository.save(content);
    return plainToInstance(ResponseContentDto, savedContent, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number): Promise<ResponseContentDto> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['author', 'plans'],
    });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found.`);
    }
    return plainToInstance(ResponseContentDto, content, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ResponseContentDto[]> {
    const contents = await this.contentRepository.find({
      relations: ['author', 'plans'],
      order: { created_at: 'DESC' },
    });
    return contents.map((content) =>
      plainToInstance(ResponseContentDto, content, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async update(
    id: number,
    updateContentDto: UpdateContentDto,
  ): Promise<ResponseContentDto> {
    const { planIds, ...contentData } = updateContentDto;
    const content = await this.contentRepository.preload({
      id: id,
      ...contentData,
    });
    if (!content) {
      throw new NotFoundException(`Conteúdo com ID ${id} não encontrado.`);
    }
    if (planIds) {
      const plans = await this.planRepository.findBy({ id: In(planIds) });
      content.plans = plans;
    }
    const savedContent = await this.contentRepository.save(content);
    return plainToInstance(ResponseContentDto, savedContent, {
      excludeExtraneousValues: true,
    });
  }
}
