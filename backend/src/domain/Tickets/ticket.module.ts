import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketsService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketModule {}
