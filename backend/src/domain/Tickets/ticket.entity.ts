import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../User/user.entity';
import { Game } from '../Games/game.entity';
import { TicketOrder } from '../TicketOrders/ticket-orders.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @Column({ name: 'game_id', type: 'integer', nullable: false })
  gameId: number;

  @Column({ name: 'qr_code', type: 'varchar', unique: true, nullable: false })
  qrCode: string;

  @CreateDateColumn({ name: 'purchase_date' })
  purchaseDate: Date;

  @Column({
    name: 'original_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  originalPrice: number;

  @Column({
    name: 'price_paid',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  pricePaid: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  ticket_order_id: number;

  @ManyToOne(() => TicketOrder, (order) => order.tickets)
  @JoinColumn({ name: 'ticket_order_id' })
  ticketOrder: TicketOrder;

  @ManyToOne(() => Game, (game) => game.tickets)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => Users, (user) => user.tickets)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
