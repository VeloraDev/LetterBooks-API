import { inject, injectable } from 'tsyringe';
import type { CreateEmailAccountDto } from './dto/create-email-account.dto.js';
import { ApiError } from 'src/shared/errors/api.error.js';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';
import type { UpdateEmailAccountDto } from './dto/update-email-account.dto.js';
import type { EmailAccount } from './interfaces/email-account.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';
import { EmailAccountRepository } from './email-account.repository.js';
import { UserService } from 'src/modules/user/user.service.js';
import { PrismaService } from 'src/shared/database/prisma.service.js';
import { HashService } from 'src/shared/services/hash.service.js';
import type { User } from 'src/modules/user/interfaces/user.interface.js';
import type { CreateUserWithEmailAccountDto } from './dto/create-user-and-email-account.dto.js';

@injectable()
export class EmailAccountService {
  constructor(
    @inject(EmailAccountRepository)
    private readonly emailAccountRepository: EmailAccountRepository,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(PrismaService)
    private readonly prismaService: PrismaService,
    @inject(HashService)
    private readonly hashService: HashService,
  ) {}

  async create(
    data: CreateEmailAccountDto,
    tx?: TransactionClient,
  ): Promise<EmailAccount> {
    await this.assertEmailAvailable(data.email);
    return this.emailAccountRepository.create(data, tx);
  }

  async createAccountWithUser(
    data: CreateUserWithEmailAccountDto,
  ): Promise<{ user: User; account: EmailAccount }> {
    return this.prismaService.$transaction(async (tx) => {
      const user = await this.userService.create(
        { username: data.username },
        tx,
      );

      const passwordHash = await this.hashService.hash(data.password);
      const account = await this.create({
        userId: user.id,
        email: data.email,
        passwordHash,
      });

      return {
        user,
        account,
      };
    });
  }

  async getById(id: string): Promise<EmailAccount | null> {
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
