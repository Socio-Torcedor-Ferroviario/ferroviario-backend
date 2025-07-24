import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  Length,
  IsIn,
} from 'class-validator';

export enum PaymentMethodType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Tipo do método de pagamento',
    enum: PaymentMethodType,
    example: PaymentMethodType.CREDIT_CARD,
  })
  @IsString({ message: 'O tipo deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo não pode ser vazio.' })
  @IsIn(Object.values(PaymentMethodType), {
    message: 'Tipo de método de pagamento inválido.',
  })
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Últimos quatro dígitos do cartão (se aplicável)',
    example: '1234',
    required: false,
  })
  @IsString({ message: 'Os últimos quatro dígitos devem ser uma string.' })
  @Length(4, 4, {
    message: 'Os últimos quatro dígitos devem ter 4 caracteres.',
  })
  @IsOptional()
  lastFourDigits?: string;

  @ApiProperty({
    description: 'Bandeira do cartão (se aplicável)',
    example: 'Visa',
    required: false,
  })
  @IsString({ message: 'A bandeira do cartão deve ser uma string.' })
  @IsOptional()
  cardBrand?: string;

  @ApiProperty({
    description: 'Data de expiração do cartão (MM/AAAA, se aplicável)',
    example: '12/2027',
    required: false,
  })
  @IsString({ message: 'A data de expiração deve ser uma string.' })
  @IsOptional()
  @Length(7, 7, {
    message: 'A data de expiração deve estar no formato MM/AAAA.',
  })
  expiryDate?: string;

  @ApiProperty({
    description: 'Indica se este é o método de pagamento padrão do usuário',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean({ message: 'O is_default deve ser um booleano.' })
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    description: 'Token de pagamento gerado pelo gateway de pagamento',
    example: 'tok_abc123def456',
  })
  @IsString({ message: 'O token do gateway deve ser uma string.' })
  @IsNotEmpty({ message: 'O token do gateway não pode ser vazio.' })
  gatewayToken: string;
}

export class UpdatePaymentMethodDto extends PartialType(
  CreatePaymentMethodDto,
) {}

@Exclude()
export class ResponsePaymentMethodDto {
  @Expose()
  @ApiProperty({
    description: 'O ID do método de pagamento',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'ID do usuário associado',
    example: 1,
  })
  userId: number;

  @Expose()
  @ApiProperty({
    description: 'Tipo do método de pagamento',
    enum: PaymentMethodType,
    example: PaymentMethodType.CREDIT_CARD,
  })
  type: PaymentMethodType;

  @Expose()
  @ApiProperty({
    description: 'Últimos quatro dígitos do cartão',
    example: '1234',
    required: false,
  })
  lastFourDigits?: string;

  @Expose()
  @ApiProperty({
    description: 'Bandeira do cartão',
    example: 'Visa',
    required: false,
  })
  cardBrand?: string;

  @Expose()
  @ApiProperty({
    description: 'Data de expiração do cartão',
    example: '12/2027',
    required: false,
  })
  expiryDate?: string;

  @Expose()
  @ApiProperty({
    description: 'Indica se é o método padrão',
    example: true,
  })
  isDefault: boolean;

  @Expose()
  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-10-26T10:00:00.000Z',
  })
  createdAt: Date;
}
