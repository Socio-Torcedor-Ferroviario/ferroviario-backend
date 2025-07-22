import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketOrder } from './ticket-orders.entity';
import { TicketsService } from '../Tickets/ticket.service';
import { PaymentsService } from '../Payments/payments.service';
import { PayableType } from '../Payments/payments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../Games/game.entity';
import { Users } from '../User/user.entity';
import {
  CreateTicketOrderDto,
  TicketOrderResponseDto,
} from './ticket-orders.schema';
import { CreateTicketsForOrderDto } from '../Tickets/ticket.schema';

@Injectable()
export class TicketOrdersService {
  constructor(
    @InjectRepository(TicketOrder)
    private readonly orderRepository: Repository<TicketOrder>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly ticketsService: TicketsService,
    private readonly paymentsService: PaymentsService,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(
    userId: number,
    orderDto: CreateTicketOrderDto,
  ): Promise<TicketOrderResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { quantity, game_id, payment } = orderDto;

    try {
      const game = await this.gameRepository.findOneBy({ id: game_id });
      if (!game) {
        throw new NotFoundException(`Game with ID ${game_id} not found.`);
      }
      if (game.status !== 'SALE_OPEN') {
        throw new BadRequestException(
          'Ticket sales for this game are not open.',
        );
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      const pricePaidPerTicket = game.base_ticket_price;
      const totalAmount = pricePaidPerTicket * quantity;

      let order = queryRunner.manager.create(TicketOrder, {
        user_id: userId,
        game_id: game_id,
        total_amount: totalAmount,
        status: 'PENDING',
      });
      order = await queryRunner.manager.save(order);

      await this.paymentsService.createPayment(
        {
          userId,
          amount: totalAmount,
          payableId: order.id,
          payableType: PayableType.TICKET_ORDER,
          paymentMethodDescription: `Credit Card ending in ${payment.card_id.slice(-4)}`,
          paymentGatewayId: 'tok_simulated_1234',
          status: 'PAID',
          paymentDate: new Date(),
        },
        queryRunner.manager,
      );

      order.status = 'CONFIRMED';
      await queryRunner.manager.save(order);

      const createTicketsDto: CreateTicketsForOrderDto = {
        orderId: order.id,
        quantity,
        game,
        user,
        pricePaidPerTicket,
      };
      const tickets = await this.ticketsService.createTicketsForOrder(
        createTicketsDto,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

      return {
        order_id: `order_${order.id}`,
        status: order.status,
        qr_code_url: `url/to/qrcode_${tickets[0].qrCode}.png`,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to create order: ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
