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
import { CreatePlanDto, ResponsePlanDto } from './plan.schema';
import { Role } from '../User/role.enum';
import { ApiAuth } from 'src/decorators/api-auth.decorator';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiAuth(Role.Admin)
  @Post()
  @ApiStandardResponse({
    status: 201,
    description: 'Plan Created Successfully',
    model: ResponsePlanDto,
  })
  async create(@Body() plan: CreatePlanDto): Promise<ResponsePlanDto> {
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
  async findAll(): Promise<ResponsePlanDto[]> {
    return await this.planService.findAll();
  }

  @ApiStandardResponse({
    status: 200,
    description: 'Plan Retrieved Successfully',
    model: ResponsePlanDto,
  })
  @Get(':id')
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
  async updatePlan(
    @Param('id') id: number,
    @Body() plan: CreatePlanDto,
  ): Promise<ResponsePlanDto | null> {
    return await this.planService.update(id, plan);
  }

  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    status: 200,
    description: 'Plan Removed Successfully',
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.planService.remove(id);
  }
}
