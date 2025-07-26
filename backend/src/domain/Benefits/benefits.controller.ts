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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Create a new benefit',
    description: 'Creates a new benefit with the provided details.',
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
  @ApiOperation({
    summary: 'Get all benefits',
    description: 'Retrieves a list of all benefits available in the system.',
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
  @ApiOperation({
    summary: 'Get benefit by ID',
    description: 'Retrieves the details of a specific benefit by its ID.',
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
  @ApiOperation({
    summary: 'Update a benefit',
    description: 'Updates the details of an existing benefit by its ID.',
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
  @ApiOperation({
    summary: 'Delete a benefit',
    description: 'Deletes a specific benefit by its ID.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.benefitsService.remove(id);
  }
}
