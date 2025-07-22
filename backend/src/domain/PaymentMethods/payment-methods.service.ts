import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-methods.entity';
import { CreatePaymentMethodDto } from './payment-methods.schema';
import { UpdatePaymentMethodDto } from './payment-methods.schema';
import { Users } from '../User/user.entity';
@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
  ): Promise<PaymentMethod> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const newPaymentMethod = this.paymentMethodRepository.create({
      ...createPaymentMethodDto,
      userId: user.id,
      user: user,
    });

    if (newPaymentMethod.isDefault) {
      await this.paymentMethodRepository
        .createQueryBuilder()
        .update(PaymentMethod)
        .set({ isDefault: false })
        .where('userId = :userId', { userId: user.id })
        .andWhere('id != :id', { id: newPaymentMethod.id || 0 })
        .execute();
    } else {
      const existingMethodsCount = await this.paymentMethodRepository.count({
        where: { userId: user.id },
      });
      if (existingMethodsCount === 0) {
        newPaymentMethod.isDefault = true;
      }
    }

    return this.paymentMethodRepository.save(newPaymentMethod);
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
