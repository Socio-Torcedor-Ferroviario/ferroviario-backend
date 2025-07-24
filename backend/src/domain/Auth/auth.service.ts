import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../User/user.service';
import {
  ChangeUserPasswordDto,
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
  UserTokenDto,
} from '../User/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { Users } from '../User/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ResponseUserDto | null> {
    {
      const user = await this.userService.findByEmailWithPassword(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        const { password, ...result } = user;
        return result as ResponseUserDto;
      }
      return null;
    }
  }

  login(user: ResponseUserDto): UserTokenDto {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = new UserTokenDto();
    accessToken.access_token = this.jwtService.sign(payload);
    accessToken.role = user.role;
    return accessToken;
  }

  async register(user: CreateUserDto): Promise<ResponseUserDto> {
    const userExists = await this.userService.findByEmail(user.email);
    if (userExists) {
      throw new ConflictException('Um usuário com este e-mail já existe.');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });

    return newUser;
  }
  async changePassword(id: number, updatePassword: ChangeUserPasswordDto) {
    const userToUpdate = await this.userService.findById(id);
    const user = plainToInstance(Users, userToUpdate, {
      excludeExtraneousValues: true,
    });
    if (!userToUpdate) {
      throw new ConflictException(`Usuário com ID ${id} não encontrado`);
    }
    if (updatePassword.cpf !== userToUpdate.cpf) {
      throw new Error('CPF não corresponde ao usuário');
    }

    const hashedPassword = await bcrypt.hash(updatePassword.password, 10);
    user.password = hashedPassword;
    await this.userService.updateUser(
      user.id,
      plainToInstance(UpdateUserDto, user, {
        excludeExtraneousValues: true,
      }),
    );

    return { message: 'Senha alterada com sucesso' };
  }
}
