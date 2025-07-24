import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async editGame(
    @Param('id') gameId: number,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<ResponseGameDto> {
    return this.gameService.editGame(gameId, updateGameDto);
  }
}
