import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import { ResponseUserDto } from './user.schema';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './role.enum';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    isArray: true,
    description: 'Users Retrieved Successfully',
    model: ResponseUserDto,
  })
  async findAllUsers(): Promise<ResponseUserDto[]> {
    return await this.userService.findAllUsers();
  }
}
