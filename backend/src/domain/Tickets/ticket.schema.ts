import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDecimal,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Game } from '../Games/game.entity';
import { Users } from '../User/user.entity';
import { PaymentRequestDto } from '../Payments/payments.schema';

@Exclude()
export class TicketDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier for the ticket',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'ID of the user who owns the ticket',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @Expose()
  @ApiProperty({
    description: 'ID of the game this ticket belongs to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  gameId: number;

  @Expose()
  @ApiProperty({
    description: 'Unique QR code for ticket validation',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @Expose()
  @ApiProperty({
    description: 'The date and time the ticket was purchased',
  })
  @IsDate()
  purchaseDate: Date;

  @Expose()
  @ApiProperty({
    description: 'The original price of the ticket, without discounts',
    example: '50.00',
  })
  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  originalPrice: number;

  @Expose()
  @ApiProperty({
    description: 'The price actually paid for the ticket, after discounts',
    example: '40.00',
  })
  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  pricePaid: number;

  @Expose()
  @ApiProperty({
    description: 'ID of the ticket order this ticket belongs to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  ticket_order_id: number;
}

export class CreateTicketDto extends OmitType(TicketDto, ['id']) {}

export class PurchaseTicketDto {
  @ApiProperty({
    description: 'ID of the game to purchase tickets for',
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
  @ValidateNested()
  @Type(() => PaymentRequestDto)
  payment: PaymentRequestDto;
}

export class CreateTicketsForOrderDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsObject()
  @IsNotEmpty()
  game: Game;

  @IsObject()
  @IsNotEmpty()
  user: Users;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  pricePaidPerTicket: number;
}

export class ResponseTicketDto extends TicketDto {}
