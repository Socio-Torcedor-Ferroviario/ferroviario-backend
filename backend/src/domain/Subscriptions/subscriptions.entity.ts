// src/domain/Subscriptions/subscriptions.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Users } from '../User/user.entity';
import { Payment } from '../Payments/payments.entity';
@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Users, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
