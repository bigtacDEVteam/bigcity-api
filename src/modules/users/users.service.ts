import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findWithFilter(paginationDto: any, userId: number): Promise<User[]> {
    // Example: simple find all. You can replace with pagination/filter logic later
    return this.userRepository.find();
  }

async findOne(id: number): Promise<User | null> {
  return this.userRepository.findOneBy({ id });
}

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    userId: any,
  ): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.userRepository.delete(id);
    return { deleted: true };
  }
}
