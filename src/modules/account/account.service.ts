import { inject, injectable } from 'tsyringe';
import { CreateEmailAccountDto } from './dto/create-email-account.dto.js';
import { TransactionClient } from 'src/shared/database/transaction-client.js';
import { HashService } from 'src/shared/services/hash.service.js';
import { EmailAccountRepository } from './repositories/email-account.repository.js';
import { ConflictError } from 'src/shared/errors/conflict.error.js';
import { EmailAccount } from './interfaces/email-account.interface.js';
import { EmailAccountResponseDto } from './dto/email-account-response.dto.js';
import { ProviderAccountRepository } from './repositories/provider-account.repository.js';
import { toEmailAccountResponse } from './account.mapper.js';

@injectable()
export class AccountService {
  constructor(
    @inject(EmailAccountRepository)
    private readonly emailAccountRepository: EmailAccountRepository,
    @inject(ProviderAccountRepository)
    private readonly providerAccountRepository: ProviderAccountRepository,
    @inject(HashService) private readonly hashService: HashService,
  ) {}

  async createEmailAccount(
    userId: string,
    data: CreateEmailAccountDto,
    tx?: TransactionClient,
  ): Promise<EmailAccountResponseDto> {
    const emailExist = await this.emailAccountRepository.findByEmail(
      data.email,
    );
    if (emailExist) {
      throw new ConflictError('Email already taken');
    }

    const passwordHash = await this.hashService.hash(data.password);
    const emailAccount = await this.emailAccountRepository.create(
      {
        userId,
        email: data.email,
        passwordHash,
      },
      tx,
    );

    return toEmailAccountResponse(emailAccount);
  }

  async getEmailAccountByEmail(email: string): Promise<EmailAccount | null> {
    return this.emailAccountRepository.findByEmail(email);
  }
}
