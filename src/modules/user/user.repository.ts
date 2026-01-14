import { prisma } from 'src/shared/database/prisma.js';
import { injectable } from 'tsyringe';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './interfaces/user.interface.js';
import type { IUserRepository } from './interfaces/user.repository.interface.js';

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: CreateUserDto): Promise<User> {
    return prisma.user.create({ data });
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
