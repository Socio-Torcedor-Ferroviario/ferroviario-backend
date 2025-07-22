import { Exclude, Expose, Type } from 'class-transformer';
import { SubscriptionStatus } from './subscription.entity';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { UserSummaryDto } from '../User/user.schema';
import { PlanSummaryDto } from '../Plans/plan.schema';
import { BenefitsSummaryDto } from '../Benefits/benefits.schema';

@Exclude()
export class SubscriptionDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the subscription',
    example: 1,
  })
  id: number;
  @Expose()
  @ApiProperty({
    description: 'The start date of the subscription',
    example: '2023-01-01',
  })
  @IsDate({ message: 'Start date must be a valid date.' })
  @IsNotEmpty({ message: 'Start date cannot be empty.' })
  start_date: Date;
  @Expose()
  @ApiProperty({
    description: 'The end date of the subscription',
    example: '2023-12-31',
    nullable: true,
  })
  end_date?: Date;
  @Expose()
  @ApiProperty({
    description: 'The next payment date for the subscription',
    example: '2023-02-01',
    nullable: true,
  })
  @IsDate({ message: 'Next payment date must be a valid date.' })
  next_payment_date?: Date;
  @Expose()
  @ApiProperty({
    description: 'The status of the subscription',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsNotEmpty({ message: 'Status cannot be empty.' })
  @IsEnum(SubscriptionStatus, {
    message: 'Status must be a valid subscription status.',
  })
  status: SubscriptionStatus;
  @Expose()
  @ApiProperty({
    description: 'Indicates if the subscription has automatic renewal',
    example: true,
  })
  @IsNotEmpty({ message: 'Automatic renewal cannot be empty.' })
  automatic_renewal: boolean;
  @Expose()
  @ApiProperty({
    description: 'The date when the subscription was created',
    example: '2023-01-01',
  })
  created_at: Date;
  @Expose()
  @ApiProperty({
    description: 'The date when the subscription was last updated',
    example: '2023-01-02',
  })
  @IsDate({ message: 'Updated at must be a valid date.' })
  updated_at: Date;
  @Expose()
  @ApiProperty({
    description:
      'The unique identifier of the user associated with the subscription',
    example: 1,
  })
  @IsNotEmpty({ message: 'User ID cannot be empty.' })
  user_id: number;
  @Expose()
  @ApiProperty({
    description:
      'The unique identifier of the plan associated with the subscription',
    example: 1,
  })
  @IsNotEmpty({ message: 'Plan ID cannot be empty.' })
  plan_id: number;
}

@Exclude()
export class ResponseSubscriptionDto extends OmitType(SubscriptionDto, [
  'created_at',
  'updated_at',
  'plan_id',
  'user_id',
] as const) {
  @Expose()
  @ApiProperty({
    description: 'The user associated with the subscription',
    type: () => UserSummaryDto,
  })
  @Type(() => UserSummaryDto)
  user: UserSummaryDto;

  @Expose()
  @ApiProperty({
    description: 'The plan associated with the subscription',
    type: () => PlanSummaryDto,
  })
  @Type(() => PlanSummaryDto)
  plan: PlanSummaryDto;

  @Expose()
  @ApiProperty({
    description: 'The benefits associated with the subscription',
    type: () => [BenefitsSummaryDto],
  })
  benefits: BenefitsSummaryDto[];
}

export class ChangePlanDto extends PickType(SubscriptionDto, [
  'plan_id',
  'automatic_renewal',
] as const) {}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the plan to subscribe to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  plan_id: number;

  @ApiProperty({
    description: 'Indicates if the subscription should renew automatically',
    example: true,
  })
  @IsBoolean()
  automatic_renewal: boolean;

  @ApiProperty({
    description: 'ID of the payment method to be used for the subscription',
    example: 42,
  })
  @IsNumber()
  @IsNotEmpty()
  paymentMethodId: number;
}
