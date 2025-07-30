import { ApiProperty } from '@nestjs/swagger';

export class IndicatorsDto {
  @ApiProperty({ example: 2847, description: 'Total de membros registrados.' })
  totalMembers: number;

  @ApiProperty({ example: 186420, description: 'Receita mensal total.' })
  monthlyRevenue: number;

  @ApiProperty({ example: 24, description: 'Número de jogos registrados.' })
  registeredGames: number;

  @ApiProperty({ example: 68, description: 'Porcentagem total de conversão.' })
  totalConversion: number;
}

export class UserDto {
  @ApiProperty({ example: 1, description: 'ID do usuário.' })
  id: number;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário.',
  })
  name: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF do usuário.' })
  cpf: string;

  @ApiProperty({ example: 'Gold', description: 'Plano do usuário.' })
  plan: string;

  @ApiProperty({
    example: 'Active',
    description: 'Status do usuário (e.g., Active, Inactive).',
  })
  status: string;

  @ApiProperty({
    example: '2024-10-31',
    description: 'Data de adesão do usuário.',
  })
  joinDate: string; 

  @ApiProperty({ example: 'joao@email.com', description: 'Email do usuário.' })
  email: string;
}

export class GameDto {
  @ApiProperty({ example: 1, description: 'ID do jogo.' })
  id: number;

  @ApiProperty({
    example: 'Ferroviário vs Ceará SC',
    description: 'Título do jogo.',
  })
  title: string;

  @ApiProperty({ example: '2024-02-09', description: 'Data do jogo.' })
  date: string; 
  @ApiProperty({ example: 'Presidente Vargas', description: 'Local do jogo.' })
  location: string;

  @ApiProperty({ example: 1250, description: 'Número de ingressos vendidos.' })
  ticketsSold: number;

  @ApiProperty({ example: 2000, description: 'Capacidade total do local.' })
  capacity: number;

  @ApiProperty({
    example: 'Sales Active',
    description: 'Status das vendas (e.g., Sales Active, Not Started).',
  })
  status: string;
}

export class PlanDto {
  @ApiProperty({ example: 1, description: 'ID do plano.' })
  id: number;

  @ApiProperty({ example: 'Gold', description: 'Nome do plano.' })
  name: string;

  @ApiProperty({ example: 120, description: 'Preço do plano.' })
  price: number;

  @ApiProperty({
    example: ['Full Access', 'Exclusive Discounts'],
    description: 'Benefícios do plano.',
  })
  benefits: string[];
}

export class ContentDto {
  @ApiProperty({ example: 1, description: 'ID do conteúdo.' })
  id: number;

  @ApiProperty({
    example: 'Coach Interview',
    description: 'Título do conteúdo.',
  })
  title: string;

  @ApiProperty({
    example: 'Video',
    description: 'Tipo de conteúdo (e.g., Video, Gallery, Audio).',
  })
  type: string;

  @ApiProperty({
    example: '2024-11-01',
    description: 'Data de publicação do conteúdo.',
  })
  date: string;
}

export class DashboardDataDto {
  @ApiProperty({
    type: IndicatorsDto,
    description: 'Indicadores gerais do dashboard.',
  })
  indicators: IndicatorsDto;

  @ApiProperty({ type: [UserDto], description: 'Lista de usuários.' })
  user: UserDto[];

  @ApiProperty({ type: [GameDto], description: 'Lista de jogos.' })
  games: GameDto[];

  @ApiProperty({ type: [PlanDto], description: 'Lista de planos.' })
  plans: PlanDto[];

  @ApiProperty({ type: [ContentDto], description: 'Lista de conteúdos.' })
  contents: ContentDto[];
}

export class DashboardResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica se ocorreu um erro na requisição.',
  })
  error: boolean;

  @ApiProperty({ type: DashboardDataDto, description: 'Dados do dashboard.' })
  data: DashboardDataDto;
}
