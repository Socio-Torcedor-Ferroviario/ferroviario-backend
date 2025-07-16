// src/domain/Payments/payments.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from '../Subscriptions/subscription.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'subscription_id', nullable: false })
  subscriptionId: number;

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

  @ManyToOne(() => Subscription, (subscription) => subscription.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;
}
