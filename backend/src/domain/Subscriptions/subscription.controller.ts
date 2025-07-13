import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../User/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import { ChangePlanDto, ResponseSubscriptionDto } from './subscription.schema';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('me')
  @Roles(Role.Socio)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'Subscription Retrieved Successfully',
    model: ResponseSubscriptionDto,
  })
  async findMySubscription(
    @GetUser() user: AuthJwtDto,
  ): Promise<ResponseSubscriptionDto> {
    return await this.subscriptionService.findMySubscription(parseInt(user.id));
  }

  @Get('change-plan')
  @Roles(Role.Socio)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'Plan Changed Successfully',
    model: ResponseSubscriptionDto,
  })
  async changePlan(
    @GetUser() user: AuthJwtDto,
    @Body() changePlanDto: ChangePlanDto,
  ): Promise<ResponseSubscriptionDto> {
    const userId = parseInt(user.id);
    return await this.subscriptionService.changePlan(userId, changePlanDto);
  }

  @Get('create-subscription')
  @Roles(Role.Socio)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'Subscription Created Successfully',
    model: ResponseSubscriptionDto,
  })
  async createSubscription(
    @GetUser() user: AuthJwtDto,
    @Body() changePlanDto: ChangePlanDto,
  ): Promise<ResponseSubscriptionDto> {
    const userId = parseInt(user.id);
    return await this.subscriptionService.createSubscription(
      userId,
      changePlanDto,
    );
  }

  @Get('cancel')
  @Roles(Role.Socio)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiStandardResponse({
    status: 200,
    description: 'Subscription Canceled Successfully',
    model: ResponseSubscriptionDto,
  })
  async cancelSubscription(
    @GetUser() user: AuthJwtDto,
  ): Promise<ResponseSubscriptionDto> {
    const userId = parseInt(user.id);
    return await this.subscriptionService.cancelSubscription(userId);
  }
}
