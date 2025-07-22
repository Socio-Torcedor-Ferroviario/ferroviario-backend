import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from '../Tickets/ticket.entity';
import { Payment } from '../Payments/payments.entity';
import { Game } from '../Games/game.entity';

@Entity('ticket_orders')
export class TicketOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  game_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Ticket, (ticket) => ticket.ticketOrder)
  tickets: Ticket[];

  @OneToMany(() => Payment, (payment) => payment.payableId, {
    cascade: false,
  })
  payments: Payment[];

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
