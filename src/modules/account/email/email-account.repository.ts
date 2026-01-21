import { injectable } from 'tsyringe';
import type { EmailAccount } from './interfaces/email-account.interface.js';
import { prisma } from 'src/shared/database/prisma.js';
import type { CreateEmailAccountDto } from './dto/create-email-account.dto.js';
import type { UpdateEmailAccountDto } from './dto/update-email-account.dto.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

@injectable()
export class EmailAccountRepository {
  async create(
    data: CreateEmailAccountDto,
    tx?: TransactionClient,
  ): Promise<EmailAccount> {
    const client = tx ?? prisma;
    return client.emailAccount.create({ data });
  }

  async findById(id: string): Promise<EmailAccount | null> {
    return prisma.emailAccount.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<EmailAccount | null> {
    return prisma.emailAccount.findUnique({ where: { email } });
  }

  async update(id: string, data: UpdateEmailAccountDto): Promise<EmailAccount> {
    return prisma.emailAccount.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await prisma.emailAccount.delete({ where: { id } });
  }
}
