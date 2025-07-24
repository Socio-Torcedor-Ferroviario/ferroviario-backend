import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Role } from './role.enum';
import { Exclude, Expose } from 'class-transformer';
import { IsCPF } from 'src/common/is-cpf.decorator';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '1',
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The full name of the user',
    example: 'Gabriel Pinheiro Palitot Pereira',
    required: true,
  })
  @IsString({ message: 'Full name must be a string.' })
  @IsNotEmpty({ message: 'Full name cannot be empty.' })
  fullName: string;

  @Expose()
  @ApiProperty({
    description: 'The CPF (Cadastro de Pessoas Físicas) of the user',
    example: '123.456.789-00',
    required: true,
  })
  @IsCPF({ message: 'CPF must be a valid Brazilian CPF.' })
  @IsNotEmpty({ message: 'CPF cannot be empty.' })
  cpf: string;

  @Expose()
  @ApiProperty({
    description: 'The birth date of the user',
    example: '1990-01-01',
    required: true,
  })
  @IsString({ message: 'Birth date must be a string.' })
  @IsNotEmpty({ message: 'Birth date cannot be empty.' })
  birthDate: string;

  @Expose()
  @ApiProperty({
    description: 'The email address of the user',
    example: 'gabrielpalitot@gmail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'The phone number of the user',
    example: '+55 11 91234-5678',
    required: false,
  })
  @IsPhoneNumber('BR', {
    message: 'Phone number must be a valid phone number.',
  })
  phone?: string;

  @Expose()
  @ApiProperty({
    description: 'The street address of the user',
    example: '123 Main St, Apt 4B',
    required: false,
  })
  @IsString({ message: 'Street address must be a string.' })
  streetAddress?: string;

  @Expose()
  @ApiProperty({
    description: 'The city of the user',
    example: 'São Paulo',
    required: false,
  })
  @IsString({ message: 'City must be a string.' })
  city?: string;

  @Expose()
  @ApiProperty({
    description: 'The state of the user',
    example: 'SP',
    required: false,
  })
  @IsString({ message: 'State must be a string.' })
  @Length(2, 2, {
    message: 'State must be exactly 2 characters long.',
  })
  state?: string;

  @Expose()
  @ApiProperty({
    description: 'The ZIP code of the user',
    example: '12345-678',
    required: false,
  })
  @IsString({ message: 'ZIP code must be a string.' })
  zipCode?: string;

  @Expose()
  @ApiProperty({
    description: 'The password of the user',
    example: 'Securepassword123.',
    required: true,
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;

  @Expose()
  @ApiProperty({
    description: 'The role of the user',
    example: 'PUBLIC',
    required: true,
  })
  @IsEnum(Role, { message: 'Role must be a valid enum value.' })
  @IsNotEmpty({ message: 'Role cannot be empty.' })
  role: Role;
}

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {}

export class DtoWithoutCPF extends OmitType(CreateUserDto, ['cpf'] as const) {}

export class UpdateUserDto extends PartialType(DtoWithoutCPF) {}

export class ChangeUserPasswordDto extends PickType(UserDto, [
  'password',
  'cpf',
]) {}

export class ResponseUserDto extends OmitType(UserDto, ['password'] as const) {}

export class LoginUserDto extends PickType(UserDto, ['email', 'password']) {}

export class UserTokenDto {
  @ApiProperty({
    description: 'The access token for the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
  @ApiProperty({
    description: 'The role of the user',
    example: 'PUBLIC',
  })
  role: Role;
}

export class UserFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter users by full name',
  })
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional({
    description: 'Filter users by CPF',
  })
  @IsOptional()
  readonly cpf?: string;

  @ApiPropertyOptional({
    description: 'Filter users by role',
    enum: Role,
  })
  @IsEnum(Role, { message: 'Role must be a valid enum value.' })
  @IsOptional()
  readonly role?: Role;
}

export class UserSummaryDto extends PickType(UserDto, [
  'id',
  'fullName',
  'email',
  'role',
]) {}
