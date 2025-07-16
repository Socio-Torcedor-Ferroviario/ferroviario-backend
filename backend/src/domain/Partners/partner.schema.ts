import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PartnerDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Partner name',
    example: 'Academia Vida Saudável',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Partner Category',
    example: 'Health and Wellness',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @Expose()
  @ApiProperty({
    description: 'Partner Location',
    example: '123 Main Street',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @Expose()
  @ApiProperty({ description: 'Partner Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @ApiProperty({
    description: 'Details of the discount offered',
    example: '20% discount on the monthly fee',
  })
  @IsString()
  @IsNotEmpty()
  discount_details: string;

  @Expose()
  @ApiProperty({
    description: 'Partner Phone Number',
    required: false,
    example: '+55 85989074300',
  })
  @IsPhoneNumber('BR', { message: 'Invalid phone number format' })
  @IsOptional()
  phone?: string;

  @Expose()
  @ApiProperty({
    description: 'Partner Website',
    required: false,
    example: 'https://www.partnerwebsite.com',
  })
  @IsString()
  @IsOptional()
  website?: string;
}

export class CreatePartnerDto extends PartnerDto {}
export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {}
export class ResponsePartnerDto extends PartnerDto {}
