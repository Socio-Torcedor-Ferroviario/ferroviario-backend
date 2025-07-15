// src/domain/PaymentMethods/dto/create-payment-method.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Length,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  gatewayToken: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CREDIT_CARD', 'PIX', 'BANK_TRANSFER'])
  type: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  lastFourDigits?: string;

  @IsOptional()
  @IsString()
  cardBrand?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePaymentMethodDto extends PartialType(
  CreatePaymentMethodDto,
) {
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class PaymentHistoryDto {
  @IsNumber()
  id: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  paymentDate: Date;

  @IsString()
  status: string;

  @IsString()
  paymentMethodDescription: string;
}
