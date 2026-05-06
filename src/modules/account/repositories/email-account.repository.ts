import { inject, injectable } from 'tsyringe';
import { PrismaService } from 'src/shared/database/prisma.service.js';
import { EmailAccount } from '../interfaces/email-account.interface.js';
import { TransactionClient } from 'src/shared/database/transaction-client.js';

@injectable()
export class EmailAccountRepository {
  constructor(
    @inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(
    data: { userId: string; email: string; passwordHash: string },
    tx?: TransactionClient,
  ): Promise<EmailAccount> {
    const client = tx ?? this.prismaService;

    return client.emailAccount.create({ data });
  }

  async findByEmail(email: string): Promise<EmailAccount | null> {
    return this.prismaService.emailAccount.findUnique({ where: { email } });
  }

  async findByUserId(userId: string): Promise<EmailAccount | null> {
    return this.prismaService.emailAccount.findUnique({ where: { userId } });
  }

  async remove(userId: string): Promise<void> {
    await this.prismaService.emailAccount.deleteMany({ where: { userId } });
  }
}
