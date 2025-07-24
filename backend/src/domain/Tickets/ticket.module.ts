import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketsService } from './ticket.service';
import { TicketOrdersModule } from '../TicketOrders/ticket-orders.module';
import { TicketsController } from './ticket.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    forwardRef(() => TicketOrdersModule),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketModule {}
