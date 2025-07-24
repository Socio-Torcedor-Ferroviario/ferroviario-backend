// src/domain/PaymentMethods/payment-methods.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import {
  CreatePaymentMethodDto,
  ResponsePaymentMethodDto,
} from './payment-methods.schema';
import { UpdatePaymentMethodDto } from './payment-methods.schema';
import { Role } from 'src/domain/User/role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from 'src/domain/Auth/auth.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';

@ApiBearerAuth()
@ApiTags('PaymentMethods')
@Controller('payments/me/methods')
@ApiAuth(Role.Socio)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @ApiStandardResponse({
    status: 200,
    description: 'Payment Methods Retrieved Successfully',
    isArray: true,
    model: ResponsePaymentMethodDto,
  })
  async listPaymentMethods(@GetUser() user: AuthJwtDto) {
    return this.paymentMethodsService.findAllMethodsForUser(parseInt(user.id));
  }

  @Post()
  @ApiStandardResponse({
    status: 201,
    description: 'Payment Method Created Successfully',
    model: ResponsePaymentMethodDto,
  })
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
  @ApiStandardResponse({
    status: 200,
    description: 'Payment Method Updated Successfully',
    model: ResponsePaymentMethodDto,
  })
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
  @ApiStandardResponse({
    status: 204,
    description: 'Payment Method Deleted Successfully',
    model: ResponsePaymentMethodDto,
  })
  async removePaymentMethod(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthJwtDto,
  ) {
    await this.paymentMethodsService.deletePaymentMethod(id, parseInt(user.id));
  }
}
