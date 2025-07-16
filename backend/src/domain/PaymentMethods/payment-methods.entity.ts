// src/domain/PaymentMethods/payment-methods.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../User/user.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ nullable: false })
  type: string;

  @Column({
    name: 'last_four_digits',
    type: 'varchar',
    length: 4,
    nullable: true,
  })
  lastFourDigits?: string;

  @Column({ name: 'card_brand', nullable: true })
  cardBrand?: string;

  @Column({ name: 'expiry_date', nullable: true })
  expiryDate?: string;

  @Column({ name: 'is_default', default: false, nullable: false })
  isDefault: boolean;

  @Column({ name: 'gateway_token', nullable: false })
  gatewayToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.paymentMethod, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
