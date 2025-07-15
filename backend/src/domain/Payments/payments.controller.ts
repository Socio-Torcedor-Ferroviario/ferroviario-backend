// src/domain/Payments/payments.controller.ts
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';
import { PaymentHistoryDto } from './payments.schema';
import { Role } from 'src/domain/User/role.enum';

@ApiBearerAuth() // Adiciona o cabeçalho de autenticação Bearer no Swagger
@ApiTags('Payments History') // Tag para organizar no Swagger
@Controller('payments/me') // O endpoint base para o histórico de pagamentos é '/payments/me'
@UseGuards(AuthGuard('jwt'), RolesGuard) // Aplica guards a todas as rotas do controller
@Roles(Role.Socio) // Define que todas as rotas neste controller requerem o papel de 'Socio'
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('history') // O endpoint completo será '/payments/me/history'
  @HttpCode(HttpStatus.OK)
  async getPaymentHistory(
    @GetUser() user: AuthJwtDto,
  ): Promise<PaymentHistoryDto[]> {
    // user.id vem como string do JWT, converta para number
    return this.paymentsService.getPaymentHistoryForUser(parseInt(user.id));
  }
}
