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
import { Role } from 'src/domain/User/role.enum';
import { PaymentsHistoryDto } from './payments.schema';

@ApiBearerAuth()
@ApiTags('PaymentsHistory')
@Controller('payments/me')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Socio)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getPaymentHistory(
    @GetUser() user: AuthJwtDto,
  ): Promise<PaymentsHistoryDto[]> {
    return this.paymentsService.getPaymentHistoryForUser(parseInt(user.id));
  }
}
