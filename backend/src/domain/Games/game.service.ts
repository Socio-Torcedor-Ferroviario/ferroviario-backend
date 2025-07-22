import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { ResponseGameDto } from './game.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly userRepository: Repository<Game>,
  ) {}

  async findGameById(id: number): Promise<ResponseGameDto> {
    const game = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(ResponseGameDto, game, {
      excludeExtraneousValues: true,
    });
  }
}
