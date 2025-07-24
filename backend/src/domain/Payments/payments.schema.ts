import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { PayableType } from './payments.entity';

@Exclude()
export class PaymentDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Payable ID',
    example: '123',
  })
  @IsNumber()
  @IsNotEmpty()
  payableId: number;

  @Expose()
  @ApiProperty({
    description: 'Payable Type',
    example: 'SUBSCRIPTION',
  })
  @IsEnum(PayableType)
  @IsNotEmpty()
  payableType: PayableType;

  @Expose()
  @ApiProperty({
    description: 'Payment Amount',
    example: '100.00',
  })
  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @Expose()
  @ApiProperty({
    description: 'Payment Date',
    example: '',
  })
  @IsDate()
  @IsNotEmpty()
  paymentDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Payment Status',
    example: 'PAID',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @Expose()
  @ApiProperty({
    description: 'Payment Method Description',
    example: 'Credit Card',
  })
  @IsNotEmpty()
  @IsString()
  paymentMethodDescription: string;

  @Expose()
  @ApiProperty({
    description: 'Paymnet Gateway Id',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  paymentGatewayId?: string;

  @Expose()
  @ApiProperty({
    description: 'Payment Method Id',
    example: '987654321',
  })
  @IsNumber()
  paymentMethodId: number;

  @Expose()
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

export class CreatePaymentDto extends OmitType(PaymentDto, ['id']) {}
export class ResponsePaymentDto extends OmitType(PaymentDto, [
  'paymentGatewayId',
]) {}

export class PaymentsHistoryDto extends PickType(PaymentDto, [
  'id',
  'amount',
  'paymentDate',
  'status',
  'paymentMethodDescription',
]) {}

export class PaymentRequestDto {
  @ApiProperty({
    description: 'ID of the Method ID',
    example: '123',
  })
  @IsNumber()
  @IsNotEmpty()
  paymentMethodId: number;
}
