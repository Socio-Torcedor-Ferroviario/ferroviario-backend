import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../User/role.enum';

export class AuthJwtDto {
  @ApiProperty({
    description: 'id of the user',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'email of the user',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'role of the user',
    type: String,
    enum: Role,
  })
  role: Role;
}
