import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketsService } from './ticket.service';
import { TicketOrdersModule } from '../TicketOrders/ticket-orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), TicketOrdersModule],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketModule {}
