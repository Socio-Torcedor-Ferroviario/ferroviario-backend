// src/domain/PaymentMethods/payment-methods.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './payment-methods.schema';
import { UpdatePaymentMethodDto } from './payment-methods.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/domain/User/role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from 'src/domain/Auth/auth.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('PaymentMethods')
@Controller('payments/me/methods')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Socio)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listPaymentMethods(@GetUser() user: AuthJwtDto) {
    return this.paymentMethodsService.findAllMethodsForUser(parseInt(user.id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addPaymentMethod(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
    @GetUser() user: AuthJwtDto,
  ) {
    return this.paymentMethodsService.createPaymentMethod(
      createPaymentMethodDto,
      parseInt(user.id),
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePaymentMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
    @GetUser() user: AuthJwtDto,
  ) {
    return this.paymentMethodsService.updatePaymentMethod(
      id,
      updatePaymentMethodDto,
      parseInt(user.id),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePaymentMethod(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthJwtDto,
  ) {
    await this.paymentMethodsService.deletePaymentMethod(id, parseInt(user.id));
  }
}
