import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dashboard.schema';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Endpoint GET para obter os dados completos do dashboard.
   * @returns {DashboardResponseDto} Os dados do dashboard.
   */
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados do dashboard recuperados com sucesso.',
    type: Promise<DashboardResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor ao recuperar os dados do dashboard.',
  })
  getDashboard(): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardData();
  }
}
