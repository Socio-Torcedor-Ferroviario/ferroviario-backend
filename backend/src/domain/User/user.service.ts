import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Brackets, Repository } from 'typeorm';
import {
  UserDto,
  ResponseUserDto,
  CreateUserDto,
  UpdateUserDto,
  UserFilterDto,
} from './user.schema';
import { plainToInstance } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async createUser(user: CreateUserDto): Promise<ResponseUserDto> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAllUsers(
    filterDto: UserFilterDto,
  ): Promise<PageDto<ResponseUserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filterDto.search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.full_name ILIKE :search', {
            search: `%${filterDto.search}%`,
          }).orWhere('user.cpf LIKE :search', {
            search: `%${filterDto.search}%`,
          });
        }),
      );
    }

    if (filterDto.role) {
      queryBuilder.andWhere('user.role = :role', {
        role: filterDto.role,
      });
    }

    if (filterDto.cpf) {
      queryBuilder.andWhere('user.cpf LIKE :cpf', {
        cpf: `%${filterDto.cpf}%`,
      });
    }

    queryBuilder
      .orderBy('user.created_at', filterDto.order)
      .skip(filterDto.skip)
      .take(filterDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const transformedEntities = entities.map((entity) =>
      plainToInstance(ResponseUserDto, entity, {
        excludeExtraneousValues: true,
      }),
    );
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: filterDto,
    });

    return new PageDto(transformedEntities, pageMetaDto);
  }

  async findByEmailWithPassword(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async findByEmail(email: string): Promise<ResponseUserDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<ResponseUserDto> {
    const oldUser = await this.userRepository.findOne({ where: { id } });
    if (!oldUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = this.userRepository.merge(oldUser, user);
    const savedUser = await this.userRepository.save(updatedUser);
    return plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }
}
