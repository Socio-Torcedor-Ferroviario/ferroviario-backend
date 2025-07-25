import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTicketsForOrderDto, ResponseTicketDto } from './ticket.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}
  async createTicketsForOrder(
    orderData: CreateTicketsForOrderDto,
    manager: EntityManager,
  ): Promise<Ticket[]> {
    const ticketsToCreate: Partial<Ticket>[] = [];
    const { quantity, orderId, game, user, pricePaidPerTicket } = orderData;

    for (let i = 0; i < quantity; i++) {
      ticketsToCreate.push({
        ticket_order_id: orderId,
        userId: user.id,
        gameId: game.id,
        qrCode: uuidv4(),
        originalPrice: game.base_ticket_price,
        pricePaid: pricePaidPerTicket,
      });
    }

    const tickets = manager.create(Ticket, ticketsToCreate);
    return manager.save(tickets);
  }

  async findAllByUserId(userId: number): Promise<ResponseTicketDto[]> {
    const tickets = await this.ticketRepository.find({
      where: { userId },
      relations: ['game'],
      order: { purchaseDate: 'DESC' },
    });

    return plainToInstance(ResponseTicketDto, tickets, {
      excludeExtraneousValues: true,
    });
  }
}
