import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentRequestDto } from '../Payments/payments.schema';

@Exclude()
export class TicketOrderDto {
  @Expose()
  @ApiProperty({
    description: 'Ticket Order Id',
    example: '1',
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'User Id',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @Expose()
  @ApiProperty({
    description: 'Game Id',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  game_id: number;

  @Expose()
  @ApiProperty({
    description: 'Total Amount',
    example: '100.00',
  })
  @IsDecimal()
  @IsNotEmpty()
  total_amount: number;

  @Expose()
  @ApiProperty({
    description: 'Status',
    example: 'PENDING',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class CreateTicketOrderDto {
  @ApiProperty({
    description: 'ID of the game',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  gameId: number;

  @ApiProperty({
    description: 'Number of tickets to purchase',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Payment details',
    type: PaymentRequestDto,
  })
  payment: PaymentRequestDto;
}

export class TicketOrderResponseDto {
  @ApiProperty()
  order_id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  qr_code_url: string;
}
