import { inject, injectable } from 'tsyringe';
import type { CreateEmailAccountDto } from './dto/create-email-account.dto.js';
import { ApiError } from 'src/shared/errors/api.error.js';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';
import type { UpdateEmailAccountDto } from './dto/update-email-account.dto.js';
import type { EmailAccount } from './interfaces/email-account.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';
import { EmailAccountRepository } from './email-account.repository.js';

@injectable()
export class EmailAccountService {
  constructor(
    @inject(EmailAccountRepository)
    private readonly emailAccountRepository: EmailAccountRepository,
  ) {}

  async create(
    data: CreateEmailAccountDto,
    tx?: TransactionClient,
  ): Promise<EmailAccount> {
    await this.assertEmailAvailable(data.email);
    return this.emailAccountRepository.create(data, tx);
  }

  async getById(id: string) {
    return this.emailAccountRepository.findById(id);
  }

  async update(id: string, data: UpdateEmailAccountDto): Promise<EmailAccount> {
    const accountExist = await this.getAccountOrThrow(id);
    if (data.email && accountExist.email !== data.email) {
      await this.assertEmailAvailable(data.email);
    }

    return this.emailAccountRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.getAccountOrThrow(id);
    await this.emailAccountRepository.remove(id);
  }

  private async getAccountOrThrow(id: string): Promise<EmailAccount> {
    const emailAccount = await this.emailAccountRepository.findById(id);
    if (!emailAccount) throw new NotFoundError('Email Account');

    return emailAccount;
  }

  private async assertEmailAvailable(email: string): Promise<void> {
    const emailAccount = await this.emailAccountRepository.findByEmail(email);
    if (emailAccount) throw new ApiError(409, 'Email already taken');
  }
}
