import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // split out numeric operator id from DTO and map to relation
    const { operator, ...rest } = createUserDto;

    const entity = this.userRepository.create({
      ...rest,
      operator: operator ? ({ id: operator } as any) : undefined, // relation
    });

    return await this.userRepository.save(entity);
  }

  async findWithFilter(_paginationDto: any, _userId: number): Promise<User[]> {
    // basic example; add filters later
    return this.userRepository.find({ relations: { operator: true } });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { operator: true },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    _userId: any,
  ): Promise<User | null> {
    const existing = await this.userRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    const { operator, ...rest } = updateUserDto;

    await this.userRepository.update(id, {
      ...rest,
      ...(operator !== undefined
        ? { operator: ({ id: operator } as any) }
        : {}),
    });

    return this.userRepository.findOne({
      where: { id },
      relations: { operator: true },
    });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.userRepository.delete(id);
    return { deleted: true };
  }
}
