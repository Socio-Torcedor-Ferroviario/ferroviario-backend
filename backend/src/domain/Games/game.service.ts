import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { CreateGameDto, ResponseGameDto, UpdateGameDto } from './game.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async findGameById(id: number): Promise<ResponseGameDto> {
    const game = await this.gameRepository.findOne({ where: { id } });
    return plainToInstance(ResponseGameDto, game, {
      excludeExtraneousValues: true,
    });
  }

  async findOpenForSale(): Promise<ResponseGameDto[]> {
    const games = await this.gameRepository.find({
      where: {
        status: 'SALE_OPEN',
        visibility: true,
      },
      order: {
        match_date: 'ASC',
      },
    });

    return plainToInstance(ResponseGameDto, games, {
      excludeExtraneousValues: true,
    });
  }

  async createGame(gameDto: CreateGameDto): Promise<ResponseGameDto> {
    const savedGame = await this.gameRepository.save(gameDto);
    return plainToInstance(ResponseGameDto, savedGame, {
      excludeExtraneousValues: true,
    });
  }

  async editGame(id: number, gameDto: UpdateGameDto) {
    const existingGame = await this.gameRepository.findOne({ where: { id } });
    if (!existingGame) {
      throw new Error('Game not found');
    }
    const updatedGame = Object.assign(existingGame, gameDto);
    const savedGame = await this.gameRepository.save(updatedGame);
    return plainToInstance(ResponseGameDto, savedGame, {
      excludeExtraneousValues: true,
    });
  }
}
