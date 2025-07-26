import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Create a new partner',
    description: 'Creates a new partner with the provided details.',
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
  @ApiOperation({
    summary: 'Get all partners',
    description: 'Retrieves a list of all partners available in the system.',
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
  @ApiOperation({
    summary: 'Update a partner by ID',
    description: 'Updates the details of a partner with the provided ID.',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<ResponsePartnerDto> {
    const partner = await this.partnerService.update(+id, updatePartnerDto);
    return partner;
  }
}
