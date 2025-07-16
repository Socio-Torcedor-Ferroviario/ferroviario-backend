import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from './partner.entity';
import { Repository } from 'typeorm';
import {
  CreatePartnerDto,
  ResponsePartnerDto,
  UpdatePartnerDto,
} from './partner.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  async create(
    createPartnerDto: CreatePartnerDto,
  ): Promise<ResponsePartnerDto> {
    const partner = this.partnerRepository.create(createPartnerDto);
    const savedPartner = await this.partnerRepository.save(partner);
    return plainToInstance(ResponsePartnerDto, savedPartner, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ResponsePartnerDto[]> {
    const partners = await this.partnerRepository.find();
    return partners.map((partner) =>
      plainToInstance(ResponsePartnerDto, partner, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findOne(id: number): Promise<ResponsePartnerDto> {
    const partner = await this.partnerRepository.findOneBy({ id });
    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${id} não encontrado.`);
    }
    return plainToInstance(ResponsePartnerDto, partner, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<ResponsePartnerDto> {
    const partner = await this.partnerRepository.findOneBy({ id });
    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${id} não encontrado.`);
    }
    const updatedPartner = this.partnerRepository.merge(
      partner,
      updatePartnerDto,
    );
    await this.partnerRepository.save(updatedPartner);
    return plainToInstance(ResponsePartnerDto, updatedPartner, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const partner = await this.partnerRepository.findOneBy({ id });
    if (!partner) {
      throw new NotFoundException(`Parceiro com ID ${id} não encontrado.`);
    }
    await this.partnerRepository.remove(partner);
  }
}
