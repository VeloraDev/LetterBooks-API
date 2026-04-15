import { PrismaService } from 'src/shared/database/prisma.service.js';
import { inject, injectable } from 'tsyringe';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './interfaces/user.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

@injectable()
export class UserRepository {
  constructor(
    @inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(data: CreateUserDto, tx?: TransactionClient): Promise<User> {
    const client = tx ?? this.prismaService;
    return client.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { username } });
  }

  async findWithAccounts(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { emailAccount: true, providerAccount: true },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.providerAccount.deleteMany({
      where: { userId: id },
    });
    await this.prismaService.emailAccount.delete({ where: { userId: id } });
    await this.prismaService.user.delete({ where: { id } });
  }
}
