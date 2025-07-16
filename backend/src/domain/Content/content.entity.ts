import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../User/user.entity';
import { Plans } from '../Plans/plans.entity';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column()
  author_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'author_id' })
  author: Users;

  @ManyToMany(() => Plans, (plan) => plan.contents)
  @JoinTable({
    name: 'plan_content_access',
    joinColumn: {
      name: 'content_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'plan_id',
      referencedColumnName: 'id',
    },
  })
  plans: Plans[];
}
