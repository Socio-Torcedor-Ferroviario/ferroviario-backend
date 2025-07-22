import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from '../Subscriptions/subscription.entity';
import { Content } from '../Content/content.entity';
import { PlanBenefit } from './plan-benefits.entity';

@Entity('plans')
export class Plans {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'MENSAL' })
  frequency: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  @OneToMany(() => PlanBenefit, (planBenefit) => planBenefit.plan)
  planBenefits: PlanBenefit[];

  @ManyToMany(() => Content, (content) => content.plans)
  contents: Content[];
}
