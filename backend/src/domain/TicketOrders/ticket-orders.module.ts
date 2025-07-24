import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketOrder } from './ticket-orders.entity';
import { TicketOrdersService } from './ticket-orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketOrder])],
  providers: [TicketOrdersService],
  exports: [TicketOrdersService],
})
export class TicketOrdersModule {}
