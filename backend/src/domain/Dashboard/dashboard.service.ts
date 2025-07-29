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
      // --- 1. Buscar e processar usuários ---
      // Carrega usuários com suas assinaturas e planos para determinar status e plano
      const allUsers = await this.usersRepository.find({
        relations: ['subscriptions', 'subscriptions.plan'],
      });

      // Filtra usuários que não são ADMIN
      const nonAdminUsers = allUsers.filter((user) => user.role !== Role.Admin);

      // Mapeia usuários para o DTO, determinando o plano e status com base nas assinaturas
      const users: UserDto[] = nonAdminUsers.map((user) => {
        const activeSubscription = user.subscriptions?.find(
          (sub) => sub.status === SubscriptionStatus.ACTIVE,
        );
        const planName = activeSubscription?.plan?.name || 'N/A';
        const status = activeSubscription ? 'Active' : 'Inactive'; // Simplificado: se tem assinatura ativa, é 'Active'

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

      // --- 2. Buscar e processar jogos ---
      // Assumindo que a entidade Ticket existe e está relacionada a Game para contar ticketsSold
      const gamesEntities = await this.gameRepository.find({
        relations: ['tickets'],
      });

      const games: GameDto[] = gamesEntities.map((game) => ({
        id: game.id,
        title: `${game.opponent_team} vs Ferroviário`, // Exemplo de título
        date: game.match_date
          ? game.match_date.toISOString().split('T')[0]
          : '',
        location: game.location,
        ticketsSold: game.tickets ? game.tickets.length : 0, // Conta o número de tickets associados
        capacity: game.capacity || 0,
        status: game.status || 'Unknown',
      }));

      // --- 3. Buscar e processar planos com benefícios ---
      // Carrega planos com seus benefícios e a entidade Benefit para obter o nome do benefício
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

      // --- 4. Buscar e processar conteúdos ---
      const contentsEntities = await this.contentRepository.find();

      const contents: ContentDto[] = contentsEntities.map((content) => ({
        id: content.id,
        title: content.title,
        type: content.type,
        date: content.created_at
          ? content.created_at.toISOString().split('T')[0]
          : '',
      }));

      // --- 5. Calcular Indicadores ---

      // Total de membros: Contagem de usuários não-ADMIN
      const totalMembers = nonAdminUsers.length;

      // Receita Mensal: Soma dos pagamentos de SUBSCRIPTION 'completed' no mês atual
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const monthlyPayments = await this.paymentRepository.find({
        where: {
          payableType: PayableType.SUBSCRIPTION,
          status: 'completed', // Ou o status que indica pagamento bem-sucedido
          paymentDate: Between(firstDayOfMonth, lastDayOfMonth), // Requer import { Between } from 'typeorm';
        },
      });

      const monthlyRevenue = monthlyPayments.reduce((sum, payment) => {
        return sum + parseFloat(payment.amount.toString());
      }, 0);

      // Jogos registrados: Contagem de jogos
      const registeredGames = gamesEntities.length;

      // Total de conversão: Percentual de usuários não-ADMIN com assinatura ATIVA
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

      // --- Montar a resposta final ---
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
