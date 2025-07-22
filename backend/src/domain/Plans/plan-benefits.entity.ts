import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Benefit } from '../Benefits/benefits.entity';
import { Plans } from './plans.entity';

@Entity('plan_benefits')
export class PlanBenefit {
  @PrimaryColumn()
  plan_id: number;

  @PrimaryColumn()
  benefit_id: number;

  @ManyToOne(() => Plans, (plan) => plan.planBenefits)
  @JoinColumn({ name: 'plan_id' })
  plan: Plans;

  @ManyToOne(() => Benefit, (benefit) => benefit.planBenefits)
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;
}
