import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/domain/User/role.enum';
import { AuthJwtDto } from '../auth.schema';

interface AuthRequest extends Request {
  user: AuthJwtDto;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const { user } = context.switchToHttp().getRequest() as AuthRequest;

    if (!user || !user.role) {
      throw new ForbiddenException(
        'Access denied. You do not have permission to access this resource.',
      );
    }
    const hasPermission = requiredRoles.some((role) => user.role === role);

    if (!hasPermission) {
      throw new ForbiddenException(
        'Access denied. You do not have permission to access this resource.',
      );
    }
    return true;
  }
}
