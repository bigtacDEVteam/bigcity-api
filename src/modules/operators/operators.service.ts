import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Operator } from 'src/entities/operator.entity';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator)
    private readonly opRepo: Repository<Operator>,
  ) {}

  async create(dto: CreateOperatorDto) {
    const entity = this.opRepo.create(dto);
    return this.opRepo.save(entity);
  }

  async list(query: { q?: string; page?: number; limit?: number }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, query.limit ?? 20);
    const where = query.q
      ? [
          { name: ILike(`%${query.q}%`) },
          { email: ILike(`%${query.q}%`) },
          { phoneNo: ILike(`%${query.q}%`) },
        ]
      : {};

    const [items, total] = await this.opRepo.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { meta: { page, limit, total }, items };
  }

  async findOne(id: number) {
    const op = await this.opRepo.findOne({ where: { id } });
    if (!op) throw new NotFoundException('Operator not found');
    return op;
  }

  async update(id: number, dto: UpdateOperatorDto) {
    const existing = await this.opRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Operator not found');
    await this.opRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const existing = await this.opRepo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Operator not found');
    await this.opRepo.delete(id);
    return { deleted: true };
  }
}
