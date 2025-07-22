import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../Tickets/ticket.entity';
import { TicketOrder } from '../TicketOrders/ticket-orders.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  opponent_team: string;

  @Column({ type: 'varchar', nullable: true })
  championship: string;

  @Column({ type: 'timestamp', nullable: false })
  match_date: Date;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: false })
  home_or_away: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  visibility: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_ticket_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.game)
  tickets: Ticket[];

  @OneToMany(() => TicketOrder, (ticketOrder) => ticketOrder.game)
  ticket_order: TicketOrder[];
}
