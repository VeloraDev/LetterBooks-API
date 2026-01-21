import { inject, injectable } from 'tsyringe';
import type { EmailAccount } from './interfaces/email-account.interface.js';
import { PrismaService } from 'src/shared/database/prisma.service.js';
import type { CreateEmailAccountDto } from './dto/create-email-account.dto.js';
import type { UpdateEmailAccountDto } from './dto/update-email-account.dto.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

@injectable()
export class EmailAccountRepository {
  constructor(
    @inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(
    data: CreateEmailAccountDto,
    tx?: TransactionClient,
  ): Promise<EmailAccount> {
    const client = tx ?? this.prismaService;
    return client.emailAccount.create({ data });
  }

  async findById(id: string): Promise<EmailAccount | null> {
    return this.prismaService.emailAccount.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<EmailAccount | null> {
    return this.prismaService.emailAccount.findUnique({ where: { email } });
  }

  async update(id: string, data: UpdateEmailAccountDto): Promise<EmailAccount> {
    return this.prismaService.emailAccount.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.emailAccount.delete({ where: { id } });
  }
}
