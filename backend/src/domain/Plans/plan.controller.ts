import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import {
  CreatePlanDto,
  ResponsePlanDto,
  ResponsePlanDtoWithoutBenefits,
  UpdatePlanDto,
} from './plan.schema';
import { Role } from '../User/role.enum';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiAuth(Role.Admin)
  @Post()
  @ApiStandardResponse({
    status: 201,
    description: 'Plan Created Successfully',
    model: ResponsePlanDtoWithoutBenefits,
  })
  @ApiOperation({
    summary: 'Create a new plan',
    description: 'Creates a new plan with the provided details.',
  })
  async create(
    @Body() plan: CreatePlanDto,
  ): Promise<ResponsePlanDtoWithoutBenefits> {
    const newPlan = await this.planService.create(plan);
    return newPlan;
  }

  @ApiStandardResponse({
    status: 200,
    isArray: true,
    description: 'Plans Retrieved Successfully',
    model: ResponsePlanDto,
  })
  @Get()
  @ApiOperation({
    summary: 'Retrieve all plans',
    description: 'Fetches all available plans from the database.',
  })
  async findAll(): Promise<ResponsePlanDto[]> {
    return await this.planService.findAll();
  }

  @ApiStandardResponse({
    status: 200,
    description: 'Plan Retrieved Successfully',
    model: ResponsePlanDto,
  })
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a specific plan by ID',
    description: 'Fetches a plan by its unique identifier.',
  })
  async findOne(@Param('id') id: number): Promise<ResponsePlanDto> {
    return await this.planService.findOne(id);
  }

  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    status: 200,
    description: 'Plan Updated Successfully',
    model: ResponsePlanDto,
  })
  @Put(':id')
  @ApiOperation({
    summary: 'Update a specific plan by ID',
    description: 'Updates the details of an existing plan.',
  })
  async updatePlan(
    @Param('id') id: number,
    @Body() plan: UpdatePlanDto,
  ): Promise<ResponsePlanDto | null> {
    return await this.planService.update(id, plan);
  }

  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    status: 200,
    description: 'Plan Removed Successfully',
  })
  @ApiOperation({
    summary: 'Remove a specific plan by ID',
    description:
      'Deletes a plan from the database using its unique identifier.',
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.planService.remove(id);
  }
}
