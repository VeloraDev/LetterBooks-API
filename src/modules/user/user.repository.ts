import { PrismaService } from 'src/shared/database/prisma.service.js';
import { inject, injectable } from 'tsyringe';
import type { User } from './interfaces/user.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';
import {
  UserOrderByWithRelationInput,
  UserWhereInput,
} from 'src/generated/prisma/models.js';
import { CreateUserDto, UpdateUserDto, UserSortBy } from './user.schema.js';

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

  async findUsersPaginated(
    limit: number,
    sortBy: UserSortBy,
    skip: number,
    username?: string,
  ): Promise<{ items: User[]; count: number }> {
    const where: UserWhereInput | undefined = username
      ? {
          username: {
            contains: username,
            mode: 'insensitive',
          },
        }
      : undefined;

    const [items, count] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        take: limit,
        skip,
        orderBy: mapOrderBy(sortBy),
      }),
      this.prismaService.user.count({ where }),
    ]);

    return { items, count };
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await Promise.all([
      this.prismaService.providerAccount.deleteMany({
        where: { userId: id },
      }),
      this.prismaService.emailAccount.deleteMany({
        where: { userId: id },
      }),
    ]);

    await this.prismaService.user.delete({ where: { id } });
  }
}

function mapOrderBy(sort: UserSortBy): UserOrderByWithRelationInput {
  switch (sort) {
    case 'newest':
      return { createdAt: 'desc' };
    case 'username':
      return { username: 'asc' };
  }
}
