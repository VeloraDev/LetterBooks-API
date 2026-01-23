import { inject, injectable } from 'tsyringe';
import { EmailAccountService } from '../account/email/email-account.service.js';
import { UserService } from '../user/user.service.js';
import type { RegisterWithEmailDto } from './dto/register-with-email.dto.js';
import { PrismaService } from 'src/shared/database/prisma.service.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';
import { HashService } from 'src/shared/services/hash.service.js';
import type { RegisterWithEmailResponseDto } from './dto/register-with-email-response.dto.js';

@injectable()
export class AuthService {
  constructor(
    @inject(EmailAccountService)
    private readonly emailAccountService: EmailAccountService,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(PrismaService)
    private readonly prismaService: PrismaService,
    @inject(HashService)
    private readonly hashService: HashService,
  ) {}

  async registerWithEmail(
    data: RegisterWithEmailDto,
  ): Promise<RegisterWithEmailResponseDto> {
    const result = await this.prismaService.$transaction(async (tx) => {
      return this.createUserWithEmail(data, tx);
    });

    return {
      id: result.id,
      username: result.username,
      email: result.emailAccount.email,
      emailVerified: !!result.emailAccount.verifiedAt,
      createdAt: result.createdAt,
    };
  }

  private async createUserWithEmail(
    data: RegisterWithEmailDto,
    tx?: TransactionClient,
  ) {
    const user = await this.userService.create({ username: data.username }, tx);

    const passwordHash = await this.hashService.hash(data.password);
    const emailAccount = await this.emailAccountService.create(
      {
        userId: user.id,
        email: data.email,
        passwordHash,
      },
      tx,
    );

    return {
      ...user,
      emailAccount,
    };
  }
}
