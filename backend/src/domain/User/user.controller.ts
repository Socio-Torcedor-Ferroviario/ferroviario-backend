import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import { ResponseUserDto, UpdateUserDto, UserFilterDto } from './user.schema';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';
import { PageDto } from 'src/common/dto/page.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Roles(Role.Socio)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'User Retrieved Successfully',
    model: ResponseUserDto,
  })
  async findMyUser(@GetUser() user: AuthJwtDto): Promise<ResponseUserDto> {
    return await this.userService.findById(parseInt(user.id));
  }

  @Put('me')
  @Roles(Role.Socio)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'User Updated Successfully',
    model: ResponseUserDto,
  })
  async updateUser(
    @GetUser() user: AuthJwtDto,
    @Body() userData: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const userId = parseInt(user.id);
    const updatedUser = await this.userService.updateUser(userId, userData);
    return updatedUser;
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    isArray: true,
    description: 'Users Retrieved Successfully',
    model: ResponseUserDto,
  })
  async findAllUsers(
    @Query() filterDto: UserFilterDto,
  ): Promise<PageDto<ResponseUserDto>> {
    return await this.userService.findAllUsers(filterDto);
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'User Retrieved Successfully',
    model: ResponseUserDto,
  })
  async findUser(@Param('id') id: string): Promise<ResponseUserDto> {
    return await this.userService.findById(parseInt(id));
  }
}
