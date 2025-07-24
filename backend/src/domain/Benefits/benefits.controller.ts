import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import {
  CreateBenefitDto,
  UpdateBenefitDto,
  ResponseBenefitDto,
} from './benefits.schema';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { Role } from '../User/role.enum';
import { plainToInstance } from 'class-transformer';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';

@ApiTags('Benefits (Admin)')
@Controller('benefits')
@ApiAuth(Role.Admin)
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  @ApiStandardResponse({
    status: 201,
    description: 'Benefit created successfully.',
    model: ResponseBenefitDto,
  })
  async create(
    @Body() createBenefitDto: CreateBenefitDto,
  ): Promise<ResponseBenefitDto> {
    const benefit = await this.benefitsService.create(createBenefitDto);
    return plainToInstance(ResponseBenefitDto, benefit);
  }

  @Get()
  @ApiStandardResponse({
    status: 200,
    description: 'List of all benefits.',
    isArray: true,
    model: ResponseBenefitDto,
  })
  async findAll(): Promise<ResponseBenefitDto[]> {
    const benefits = await this.benefitsService.findAll();
    return plainToInstance(ResponseBenefitDto, benefits);
  }

  @Get(':id')
  @ApiStandardResponse({
    status: 200,
    description: 'Benefit details by ID.',
    model: ResponseBenefitDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseBenefitDto> {
    const benefit = await this.benefitsService.findOne(id);
    return plainToInstance(ResponseBenefitDto, benefit);
  }

  @Put(':id')
  @ApiStandardResponse({
    status: 200,
    description: 'Benefit updated successfully.',
    model: ResponseBenefitDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBenefitDto: UpdateBenefitDto,
  ): Promise<ResponseBenefitDto> {
    const benefit = await this.benefitsService.update(id, updateBenefitDto);
    return plainToInstance(ResponseBenefitDto, benefit);
  }

  @Delete(':id')
  @ApiStandardResponse({
    status: 200,
    description: 'Benefit deleted successfully.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.benefitsService.remove(id);
  }
}
