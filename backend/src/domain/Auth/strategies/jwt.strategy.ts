import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/domain/User/user.service';
import { AuthJwtDto } from '../auth.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in .env file or environment variables.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<any> {
    const user = await this.userService.findById(parseInt(payload.sub));

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado ou token inválido.',
      );
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    } as AuthJwtDto;
  }
}
