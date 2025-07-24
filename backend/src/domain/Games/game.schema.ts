import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class GameDto {
  @Expose()
  @ApiProperty({
    description: 'Game ID',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Opponent Team',
    example: 'Team A',
  })
  @IsNotEmpty()
  @IsString()
  opponent_team: string;

  @Expose()
  @ApiProperty({
    description: 'Championship',
    example: 'Championship X',
  })
  @IsOptional()
  @IsString()
  championship: string;

  @Expose()
  @ApiProperty({
    description: 'Match Date',
    example: '2023-10-26T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  match_date: Date;

  @Expose()
  @ApiProperty({
    description: 'Location',
    example: 'Stadium X',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @Expose()
  @ApiProperty({
    description: 'Home or Away',
    example: 'Home',
  })
  @IsNotEmpty()
  @IsString()
  home_or_away: string;

  @Expose()
  @ApiProperty({
    description: 'Capacity',
    example: 10000,
  })
  @IsOptional()
  @IsNumber()
  capacity: number;

  @Expose()
  @ApiProperty({
    description: 'Status',
    example: 'Open',
  })
  @IsOptional()
  @IsString()
  status: string;

  @Expose()
  @ApiProperty({
    description: 'Visibility',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  visibility: boolean;

  @Expose()
  @ApiProperty({
    description: 'Base Ticket Price',
    example: 50.0,
  })
  @IsOptional()
  @IsDecimal()
  base_ticket_price: number;
}

export class CreateGameDto extends OmitType(GameDto, ['id']) {}
export class ResponseGameDto extends GameDto {}
export class UpdateGameDto extends PartialType(CreateGameDto) {}
