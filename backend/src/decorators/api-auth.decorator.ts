import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'src/domain/User/role.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/domain/Auth/guards/roles.guard'; // Verifique o caminho do seu RolesGuard
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiAuth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Usuário não autenticado.' }),
    ApiForbiddenResponse({
      description: `Acesso negado. Requer uma das seguintes roles: [${roles.join(', ')}]`,
    }),
  );
}
