// src/domain/Tickets/ticket.controller.ts

import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { Role } from '../User/role.enum';
import { TicketOrdersService } from '../TicketOrders/ticket-orders.service';
import { TicketOrderResponseDto } from '../TicketOrders/ticket-orders.schema';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';
import { PurchaseTicketDto, ResponseTicketDto } from './ticket.schema';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import { TicketsService } from './ticket.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketOrdersService: TicketOrdersService,
    private readonly ticketService: TicketsService,
  ) {}

  @Post('purchase')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    status: 201,
    description: 'Ticket Order Created Successfully',
    model: TicketOrderResponseDto,
  })
  async purchase(
    @GetUser() user: AuthJwtDto,
    @Body() purchaseDto: PurchaseTicketDto,
  ): Promise<TicketOrderResponseDto> {
    return this.ticketOrdersService.createOrder(parseInt(user.id), purchaseDto);
  }

  @Get('me')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    status: 200,
    description: 'Tickets Retrieved Successfully',
    isArray: true,
    model: ResponseTicketDto,
  })
  async getMyTickets(
    @GetUser() user: AuthJwtDto,
  ): Promise<ResponseTicketDto[]> {
    return await this.ticketService.findAllByUserId(parseInt(user.id));
  }
}
