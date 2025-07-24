import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../User/user.entity';
import { PaymentMethod } from '../PaymentMethods/payment-methods.entity';

export enum PayableType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  TICKET_ORDER = 'TICKET_ORDER',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payable_id', nullable: false })
  payableId: number;

  @Column({
    name: 'payable_type',
    type: 'enum',
    enum: PayableType,
    nullable: false,
  })
  payableType: PayableType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ name: 'payment_date', type: 'timestamp', nullable: false })
  paymentDate: Date;

  @Column({ nullable: false })
  status: string;

  @Column({ name: 'payment_method_description', nullable: false })
  paymentMethodDescription: string;

  @Column({ name: 'payment_gateway_id', nullable: true })
  paymentGatewayId?: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'payment_method_id', nullable: true })
  paymentMethodId: number;

  @ManyToOne(() => PaymentMethod, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
