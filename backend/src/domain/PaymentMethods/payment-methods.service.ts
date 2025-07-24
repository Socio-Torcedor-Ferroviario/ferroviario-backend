import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaymentMethod } from './payment-methods.entity';
import {
  CreatePaymentMethodDto,
  ResponsePaymentMethodDto,
} from './payment-methods.schema';
import { UpdatePaymentMethodDto } from './payment-methods.schema';
import { Users } from '../User/user.entity';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllMethodsForUser(userId: number): Promise<PaymentMethod[]> {
    return this.paymentMethodRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'ASC' },
    });
  }

  async createPaymentMethod(
    createPaymentMethodDto: CreatePaymentMethodDto,
    userId: number,
  ): Promise<ResponsePaymentMethodDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      let newPaymentMethod = this.paymentMethodRepository.create({
        ...createPaymentMethodDto,
        userId: user.id,
      });

      const existingMethodsCount = await this.paymentMethodRepository.count({
        where: { userId: user.id },
      });

      if (createPaymentMethodDto.isDefault || existingMethodsCount === 0) {
        newPaymentMethod.isDefault = true;
        await queryRunner.manager.update(
          PaymentMethod,
          { userId: user.id },
          { isDefault: false },
        );
      }

      newPaymentMethod = await queryRunner.manager.save(newPaymentMethod);

      await queryRunner.commitTransaction();

      return plainToInstance(ResponsePaymentMethodDto, newPaymentMethod, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create payment method`);
    } finally {
      await queryRunner.release();
    }
  }

  async updatePaymentMethod(
    id: number,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
    userId: number,
  ): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found.`);
    }

    if (paymentMethod.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this payment method.',
      );
    }

    if (updatePaymentMethodDto.isDefault === true) {
      await this.paymentMethodRepository
        .createQueryBuilder()
        .update(PaymentMethod)
        .set({ isDefault: false })
        .where('userId = :userId', { userId })
        .execute();
    }

    Object.assign(paymentMethod, updatePaymentMethodDto);

    return this.paymentMethodRepository.save(paymentMethod);
  }

  async deletePaymentMethod(id: number, userId: number): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found.`);
    }

    if (paymentMethod.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this payment method.',
      );
    }

    await this.paymentMethodRepository.delete(id);

    const remainingMethods = await this.paymentMethodRepository.find({
      where: { userId },
    });
    if (
      remainingMethods.length > 0 &&
      !remainingMethods.some((pm) => pm.isDefault)
    ) {
      remainingMethods[0].isDefault = true;
      await this.paymentMethodRepository.save(remainingMethods[0]);
    }
  }
}
