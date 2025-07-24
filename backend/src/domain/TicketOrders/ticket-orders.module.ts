import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketOrder } from './ticket-orders.entity';
import { TicketOrdersService } from './ticket-orders.service';
import { GamesModule } from '../Games/game.module';
import { TicketModule } from '../Tickets/ticket.module';
import { PaymentsModule } from '../Payments/payments.module';
import { UserModule } from '../User/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketOrder]),
    GamesModule,
    PaymentsModule,
    UserModule,
    forwardRef(() => TicketModule),
  ],
  providers: [TicketOrdersService],
  exports: [TicketOrdersService],
})
export class TicketOrdersModule {}
