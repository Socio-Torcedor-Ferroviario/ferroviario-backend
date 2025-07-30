import { Body, Controller, Post, UseGuards, Put } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ResponseUserDto,
  LoginUserDto,
  UserTokenDto,
  CreateUserDto,
  ChangeUserPasswordDto,
} from '../User/user.schema';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @Post('register')
  @ApiStandardResponse({
    status: 201,
    description: 'User Registered Successfully',
    model: ResponseUserDto,
  })
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user in the system.',
  })
  async registerUser(@Body() user: CreateUserDto): Promise<ResponseUserDto> {
    const newUser = await this.authService.register(user);
    return newUser;
  }

  @ApiBody({ type: LoginUserDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiStandardResponse({
    status: 200,
    description: 'User Logged In Successfully',
    model: UserTokenDto,
  })
  @ApiOperation({
    summary: 'Login a user',
    description: 'Endpoint to login a user and return a JWT token.',
  })
  loginUser(@GetUser() user: ResponseUserDto): UserTokenDto {
    const token = this.authService.login(user);
    return token;
  }

  @Put('change-password')
  @ApiStandardResponse({
    status: 204,
    description: 'Password Changed Successfully',
  })
  @ApiOperation({
    summary: 'Change user password',
    description: 'Endpoint to change the password of the authenticated user.',
  })
  async resetPassword(
    @Body() updatePassword: ChangeUserPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(updatePassword);
  }
}
