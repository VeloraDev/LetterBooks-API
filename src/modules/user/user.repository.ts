import { prisma } from 'src/shared/database/prisma.js';
import { injectable } from 'tsyringe';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './interfaces/user.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

@injectable()
export class UserRepository {
  async create(data: CreateUserDto, tx?: TransactionClient): Promise<User> {
    const client = tx ?? prisma;
    return client.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
