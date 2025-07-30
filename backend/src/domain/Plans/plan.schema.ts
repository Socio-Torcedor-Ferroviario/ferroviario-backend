// src/domain/Plans/dto/create-plan.dto.ts

import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsArray,
} from 'class-validator';
import { BenefitsSummaryDto } from '../Benefits/benefits.schema';
import { ContentDtoSummary } from '../Content/content.schema';

export class CreatePlanDto {
  @ApiProperty({
    description: 'O nome do plano',
    example: 'Plano Ouro',
  })
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @ApiProperty({
    description: 'A descrição detalhada do plano',
    example: 'Acesso a todos os benefícios exclusivos.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'O preço do plano',
    example: 99.9,
  })
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @IsPositive({ message: 'O preço deve ser um valor positivo.' })
  price: number;

  @ApiProperty({
    description: 'A frequência de cobrança do plano',
    example: 'Mensal',
  })
  @IsString({ message: 'A frequência deve ser uma string.' })
  @IsNotEmpty({ message: 'A frequência não pode ser vazia.' })
  frequency: string;
}

@Exclude()
export class ResponsePlanDto {
  @Expose()
  @ApiProperty({
    description: 'O ID do plano',
    example: '12345',
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'O nome do plano',
    example: 'Plano Ouro',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'A descrição detalhada do plano',
    example: 'Acesso a todos os benefícios exclusivos.',
    required: false,
  })
  description?: string;

  @Expose()
  @ApiProperty({
    description: 'O preço do plano',
    example: 99.9,
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: 'A frequência de cobrança do plano',
    example: 'Mensal',
  })
  frequency: string;

  @Expose()
  @ApiProperty({
    description: 'Beneficios do Plano',
    type: () => [BenefitsSummaryDto],
  })
  @Type(() => BenefitsSummaryDto)
  benefits: BenefitsSummaryDto[];

  @Expose()
  @ApiProperty({
    description: 'Conteúdos associados ao plano',
    type: () => [ContentDtoSummary],
  })
  @Type(() => ContentDtoSummary)
  contents: ContentDtoSummary[];
}

export class ResponsePlanDtoWithoutBenefits extends OmitType(ResponsePlanDto, [
  'benefits',
] as const) {}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @ApiProperty({
    description: 'A list of benefit IDs to associate with this plan.',
    example: [1, 2, 5],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  benefit_ids?: number[];
}

export class PlanSummaryDto extends PickType(ResponsePlanDto, [
  'id',
  'name',
  'price',
] as const) {
  @ApiProperty({
    description: 'Description of Benefits of the plan',
  })
  @Expose()
  @ApiProperty({
    description: 'The benefits associated with the plan',
    type: () => [BenefitsSummaryDto],
  })
  @Type(() => BenefitsSummaryDto)
  benefits: BenefitsSummaryDto[];
}

export class PlanSummaryOnlyPlanDto extends PickType(PlanSummaryDto, [
  'id',
  'name',
  'price',
] as const) {}
