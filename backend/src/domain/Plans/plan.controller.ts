import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Plans } from './plans.entity';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiBody({ type: Plans })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Plan Created Successfully',
    type: Plans,
  })
  async create(@Body() plan: Partial<Plans>): Promise<Plans> {
    return await this.planService.create(plan);
  }

  @ApiResponse({
    status: 200,
    description: 'List of Plans',
    type: [Plans],
  })
  @Get()
  async findAll(): Promise<Plans[]> {
    return await this.planService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Plan Details',
    type: Plans,
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Plans | null> {
    return await this.planService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Plan Removed Successfully',
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.planService.remove(id);
  }
}
