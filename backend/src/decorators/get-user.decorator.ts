import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ResponseUserDto } from 'src/domain/User/user.schema';

interface RequestWithUser extends Request {
  user: ResponseUserDto;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
