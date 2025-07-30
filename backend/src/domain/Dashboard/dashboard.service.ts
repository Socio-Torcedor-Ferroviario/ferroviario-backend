import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DashboardResponseDto,
  DashboardDataDto,
  IndicatorsDto,
  UserDto,
  GameDto,
  PlanDto,
  ContentDto,
} from './dashboard.schema';
import { Between } from 'typeorm';
import { Users } from '../User/user.entity';
import { Role } from '../User/role.enum';
import { Game } from '../Games/game.entity';
import { Plans } from '../Plans/plans.entity';
import { Content } from '../Content/content.entity';
import {
  Subscription,
  SubscriptionStatus,
} from '../Subscriptions/subscription.entity';
import { Payment } from '../Payments/payments.entity';
import { PayableType } from '../Payments/payments.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Plans)
    private plansRepository: Repository<Plans>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  /**
   * Retorna os dados completos do dashboard, calculados a partir das entidades do banco de dados.
   * @returns {Promise<DashboardResponseDto>} Os dados do dashboard.
   */
  async getDashboardData(): Promise<DashboardResponseDto> {
    try {
      const allUsers = await this.usersRepository.find({
        relations: ['subscriptions', 'subscriptions.plan'],
      });

      const nonAdminUsers = allUsers.filter((user) => user.role !== Role.Admin);

      const users: UserDto[] = nonAdminUsers.map((user) => {
        const activeSubscription = user.subscriptions?.find(
          (sub) => sub.status === SubscriptionStatus.ACTIVE,
        );
        const planName = activeSubscription?.plan?.name || 'N/A';
        const status = activeSubscription ? 'Active' : 'Inactive';
        return {
          id: user.id,
          name: user.fullName,
          cpf: user.cpf,
          plan: planName,
          status: status,
          joinDate: user.createdAt
            ? user.createdAt.toISOString().split('T')[0]
            : '',
          email: user.email,
        };
      });

      const gamesEntities = await this.gameRepository.find({
        relations: ['tickets'],
      });

      const games: GameDto[] = gamesEntities.map((game) => ({
        id: game.id,
        title: `${game.opponent_team} vs Ferroviário`,
        date: game.match_date
          ? game.match_date.toISOString().split('T')[0]
          : '',
        location: game.location,
        ticketsSold: game.tickets ? game.tickets.length : 0,
        capacity: game.capacity || 0,
        status: game.status || 'Unknown',
      }));

      const plansEntities = await this.plansRepository.find({
        relations: ['planBenefits', 'planBenefits.benefit'],
      });

      const plans: PlanDto[] = plansEntities.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: parseFloat(plan.price.toString()),
        benefits: plan.planBenefits
          ? plan.planBenefits.map((pb) => pb.benefit.name)
          : [],
      }));

      const contentsEntities = await this.contentRepository.find();

      const contents: ContentDto[] = contentsEntities.map((content) => ({
        id: content.id,
        title: content.title,
        type: content.type,
        date: content.created_at
          ? content.created_at.toISOString().split('T')[0]
          : '',
      }));

      const totalMembers = nonAdminUsers.length;

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const monthlyPayments = await this.paymentRepository.find({
        where: {
          payableType: PayableType.SUBSCRIPTION,
          status: 'completed',
          paymentDate: Between(firstDayOfMonth, lastDayOfMonth),
        },
      });

      const monthlyRevenue = monthlyPayments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount.toString());
      }, 0);

      const registeredGames = gamesEntities.length;

      const activeNonAdminMembers = nonAdminUsers.filter((user) =>
        user.subscriptions?.some(
          (sub) => sub.status === SubscriptionStatus.ACTIVE,
        ),
      ).length;

      const totalConversion =
        totalMembers > 0
          ? Math.round((activeNonAdminMembers / totalMembers) * 100)
          : 0;

      const indicators: IndicatorsDto = {
        totalMembers,
        monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
        registeredGames,
        totalConversion,
      };

      const dashboardData: DashboardDataDto = {
        indicators,
        user: users,
        games,
        plans,
        contents,
      };

      return {
        error: false,
        data: dashboardData,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw new InternalServerErrorException(
        'Erro ao recuperar os dados do dashboard.',
      );
    }
  }
}
