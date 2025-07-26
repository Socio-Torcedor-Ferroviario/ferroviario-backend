import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto, ResponseGameDto, UpdateGameDto } from './game.schema';
import { ApiAuth } from 'src/decorators/api-auth.decorator';
import { Role } from '../User/role.enum';
import { ApiStandardResponse } from 'src/decorators/api-standard-response.decorator';

@ApiTags('Games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    description: 'Games Retrieved Successfully',
    status: 200,
    isArray: true,
    model: ResponseGameDto,
  })
  @ApiOperation({
    summary: 'Retrieve all games',
    description: 'Fetches a list of all available games.',
  })
  async findAll(): Promise<ResponseGameDto[]> {
    return this.gameService.findGames();
  }

  @Get('open-for-sale')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    description: 'Games Retrieved Successfully',
    status: 200,
    isArray: true,
    model: ResponseGameDto,
  })
  @ApiOperation({
    summary: 'Retrieve all games open for sale',
    description:
      'Fetches a list of all games that are currently open for sale.',
  })
  async findAllOpenForSale(): Promise<ResponseGameDto[]> {
    return this.gameService.findOpenForSale();
  }

  @Get(':id')
  @ApiAuth(Role.Socio)
  @ApiStandardResponse({
    description: 'Game Retrieved Successfully',
    status: 200,
    model: ResponseGameDto,
  })
  @ApiOperation({
    summary: 'Retrieve a game by ID',
    description: 'Fetches details of a specific game using its ID.',
  })
  async findOne(@Param('id') id: number): Promise<ResponseGameDto> {
    const game = await this.gameService.findGameById(id);
    return game;
  }

  @Post()
  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    description: 'Game Created Successfully',
    status: 201,
    model: ResponseGameDto,
  })
  @ApiOperation({
    summary: 'Create a new game',
    description: 'Creates a new game with the provided details.',
  })
  async create(@Body() createGameDto: CreateGameDto): Promise<ResponseGameDto> {
    const game = await this.gameService.createGame(createGameDto);
    return game;
  }

  @Put(':id')
  @ApiAuth(Role.Admin)
  @ApiStandardResponse({
    description: 'Game Updated Successfully',
    status: 200,
    model: ResponseGameDto,
  })
  @ApiOperation({
    summary: 'Edit an existing game',
    description: 'Updates the details of an existing game using its ID.',
  })
  async editGame(
    @Param('id') gameId: number,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<ResponseGameDto> {
    return this.gameService.editGame(gameId, updateGameDto);
  }
}
