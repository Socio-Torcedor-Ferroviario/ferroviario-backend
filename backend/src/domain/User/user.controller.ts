import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import { ResponseUserDto, UpdateUserDto, UserFilterDto } from './user.schema';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from './role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';
import { PageDto } from 'src/common/dto/page.dto';
import { ApiAuth } from 'src/decorators/api-auth.decorator';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiAuth(Role.Socio)
  @Get('me')
  @ApiStandardResponse({
    status: 200,
    description: 'User Retrieved Successfully',
    model: ResponseUserDto,
  })
  @ApiOperation({
    summary: 'Retrieve My User',
    description: "Get the current user's details.",
  })
  async findMyUser(@GetUser() user: AuthJwtDto): Promise<ResponseUserDto> {
    return await this.userService.findById(parseInt(user.id));
  }

  @ApiAuth(Role.Socio)
  @Put('me')
  @ApiStandardResponse({
    status: 200,
    description: 'User Updated Successfully',
    model: ResponseUserDto,
  })
  @ApiOperation({
    summary: 'Update My User',
    description: "Update the current user's details.",
  })
  async updateUser(
    @GetUser() user: AuthJwtDto,
    @Body() userData: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const userId = parseInt(user.id);
    const updatedUser = await this.userService.updateUser(userId, userData);
    return updatedUser;
  }

  @ApiAuth(Role.Admin)
  @Get()
  @ApiStandardResponse({
    status: 200,
    isArray: true,
    description: 'Users Retrieved Successfully',
    model: ResponseUserDto,
  })
  @ApiOperation({
    summary: 'Retrieve All Users',
    description: 'Get a paginated list of all users.',
  })
  async findAllUsers(
    @Query() filterDto: UserFilterDto,
  ): Promise<PageDto<ResponseUserDto>> {
    return await this.userService.findAllUsers(filterDto);
  }

  @ApiAuth(Role.Admin)
  @Get(':id')
  @ApiStandardResponse({
    status: 200,
    description: 'User Retrieved Successfully',
    model: ResponseUserDto,
  })
  @ApiOperation({
    summary: 'Retrieve User by ID',
    description: 'Get user details by their ID.',
  })
  async findUser(@Param('id') id: string): Promise<ResponseUserDto> {
    return await this.userService.findById(parseInt(id));
  }
}
