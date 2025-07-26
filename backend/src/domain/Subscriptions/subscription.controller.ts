import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { Role } from '../User/role.enum';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';
import {
  ChangePlanDto,
  CreateSubscriptionDto,
  ResponseSubscriptionDto,
} from './subscription.schema';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthJwtDto } from '../Auth/auth.schema';
import { ApiAuth } from 'src/decorators/api-auth.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiAuth(Role.Socio)
  @Get('me')
  @ApiStandardResponse({
    status: 200,
    description: 'Subscription Retrieved Successfully',
    model: ResponseSubscriptionDto,
  })
  @ApiOperation({
    summary: 'Retrieve My Subscription',
    description: "Get the current user's subscription details.",
  })
  async findMySubscription(
    @GetUser() user: AuthJwtDto,
  ): Promise<ResponseSubscriptionDto[]> {
    return await this.subscriptionService.findMySubscription(parseInt(user.id));
  }

  @Put('change-plan')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    status: 200,
    description: 'Plan Changed Successfully',
    model: ResponseSubscriptionDto,
  })
  @ApiOperation({
    summary: 'Change Subscription Plan',
    description: 'Change the current subscription plan for the user.',
  })
  async changePlan(
    @GetUser() user: AuthJwtDto,
    @Body() changePlanDto: ChangePlanDto,
  ): Promise<ResponseSubscriptionDto> {
    const userId = parseInt(user.id);
    return await this.subscriptionService.changePlan(userId, changePlanDto);
  }

  @Post('create-subscription')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    status: 201,
    description: 'Subscription Created Successfully',
    model: ResponseSubscriptionDto,
  })
  @ApiOperation({
    summary: 'Create Subscription',
    description: 'Create a new subscription for the user.',
  })
  async createSubscription(
    @GetUser() user: AuthJwtDto,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<ResponseSubscriptionDto> {
    const userId = parseInt(user.id);
    return await this.subscriptionService.createSubscription(
      userId,
      createSubscriptionDto,
    );
  }

  @Get('cancel')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    status: 200,
    description: 'Subscription Canceled Successfully',
    model: ResponseSubscriptionDto,
  })
  @ApiOperation({
    summary: 'Cancel Subscription',
    description: 'Cancel the current subscription for the user.',
  })
  async cancelSubscription(
    @GetUser() user: AuthJwtDto,
  ): Promise<ResponseSubscriptionDto> {
    const userId = parseInt(user.id);
    return await this.subscriptionService.cancelSubscription(userId);
  }
}
