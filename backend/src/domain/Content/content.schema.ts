import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserSummaryDto } from '../User/user.schema';
import { PlanSummaryOnlyPlanDto } from '../Plans/plan.schema';

@Exclude()
export class ContentDto {
  @Expose()
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @Expose()
  @ApiProperty({ example: 'Breaking News' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @ApiProperty({ example: 'This is the body of the news article.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @Expose()
  @ApiProperty({ example: 'news' })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class CreateContentDto extends ContentDto {
  @ApiProperty({
    description: 'Array de IDs dos planos que podem acessar este conteúdo.',
    example: [1, 3],
    required: false,
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  planIds?: number[];
}

export class UpdateContentDto extends PartialType(CreateContentDto) {}

@Exclude()
export class ResponseContentDto extends ContentDto {
  @Expose()
  @Type(() => UserSummaryDto)
  @ApiProperty({ type: () => UserSummaryDto })
  author: UserSummaryDto;
  @Expose()
  @Type(() => PlanSummaryOnlyPlanDto)
  @ApiProperty({ type: () => PlanSummaryOnlyPlanDto, isArray: true })
  plans: PlanSummaryOnlyPlanDto[];
}

export class ContentDtoSummary extends PickType(ContentDto, [
  'id',
  'title',
  'body',
  'type',
] as const) {}
