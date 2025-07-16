import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PartnerService } from './partner.service';
import {
  CreatePartnerDto,
  ResponsePartnerDto,
  UpdatePartnerDto,
} from './partner.schema';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { Role } from '../User/role.enum';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';

@ApiTags('Partners')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    description: 'Partner Created Successfully',
    status: 201,
    model: ResponsePartnerDto,
  })
  async create(
    @Body() createPartnerDto: CreatePartnerDto,
  ): Promise<ResponsePartnerDto> {
    const partner = await this.partnerService.create(createPartnerDto);
    return partner;
  }

  @Get()
  @ApiAuth(Role.Socio, Role.Admin)
  @ApiStandardResponse({
    description: 'Partners Retrieved Successfully',
    status: 200,
    isArray: true,
    model: ResponsePartnerDto,
  })
  async findAll(): Promise<ResponsePartnerDto[]> {
    const partners = await this.partnerService.findAll();
    return partners;
  }

  @Patch(':id')
  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    description: 'Partner Updated Successfully',
    status: 200,
    model: ResponsePartnerDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<ResponsePartnerDto> {
    const partner = await this.partnerService.update(+id, updatePartnerDto);
    return partner;
  }
}
