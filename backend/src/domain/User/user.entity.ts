// src/domain/User/user.entity.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Exclude } from 'class-transformer';
import { PaymentMethod } from '../PaymentMethods/payment-methods.entity';
import { Subscription } from '../Subscriptions/subscription.entity';
import { Content } from '../Content/content.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'street_address', nullable: true })
  streetAddress: string;

  @Column({ nullable: true })
  city: string;

  @Column({ length: 2, nullable: true })
  state: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Public,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethod: PaymentMethod[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Content, (content) => content.author)
  contents: Content[];
}
