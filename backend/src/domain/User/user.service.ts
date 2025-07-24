import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import {
  UserDto,
  ResponseUserDto,
  CreateUserDto,
  UpdateUserDto,
  UserFilterDto,
  ChangeUserPasswordDto,
} from './user.schema';
import { plainToInstance } from 'class-transformer';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { Role } from './role.enum';

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

  async updateUser(
    id: number,
    userData: UpdateUserDto,
    manager: EntityManager = this.userRepository.manager,
  ): Promise<ResponseUserDto> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (userData.role && userToUpdate.role !== Role.Public) {
      delete userData.role;
    }

    const updatedUser = this.userRepository.merge(userToUpdate, userData);

    const savedUser = await manager.save(updatedUser);

    return plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async changeUserPassword(
    id: number,
    updatePassword: ChangeUserPasswordDto,
  ): Promise<ResponseUserDto> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    if (updatePassword.cpf !== userToUpdate.cpf) {
      throw new NotFoundException('CPF não corresponde ao usuário');
    }
    userToUpdate.password = updatePassword.password;
    const updatedUser = await this.userRepository.save(userToUpdate);
    return plainToInstance(ResponseUserDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
