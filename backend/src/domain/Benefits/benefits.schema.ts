import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class BenefitDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier for the benefit',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the benefit',
    example: 'Free ticket (1 per month)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @ApiProperty({
    description: 'A detailed description of the benefit',
    example: 'Grants one free ticket to any game within the month.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @Expose()
  @ApiProperty({
    description: 'Indicates if the benefit is currently active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'The date and time the benefit was created',
  })
  @IsDate()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'The date and time the benefit was last updated',
  })
  @IsDate()
  updatedAt: Date;
}

export class CreateBenefitDto extends OmitType(BenefitDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class ResponseBenefitDto extends BenefitDto {}

export class UpdateBenefitDto extends PartialType(CreateBenefitDto) {}

export class BenefitsSummaryDto extends PickType(ResponseBenefitDto, [
  'id',
  'name',
  'isActive',
] as const) {}
