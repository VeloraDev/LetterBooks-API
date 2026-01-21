import { inject, injectable } from 'tsyringe';
import { EmailAccountService } from '../account/email/email-account.service.js';
import { UserService } from '../user/user.service.js';
import type { RegisterWithEmailDto } from './dto/register-with-email.dto.js';
import { PrismaService } from 'src/shared/database/prisma.service.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

@injectable()
export class AuthService {
  constructor(
    @inject(EmailAccountService)
    private readonly emailAccountService: EmailAccountService,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  async registerWithEmail(data: RegisterWithEmailDto) {
    const result = await this.prismaService.$transaction(
      async (tx: TransactionClient) => {
        const user = await this.userService.create(
          { username: data.username },
          tx,
        );

        const emailAccount = await this.emailAccountService.create(
          {
            userId: user.id,
            email: data.email,
            passwordHash: data.password,
          },
          tx,
        );

        return {
          ...user,
          emailAccount,
        };
      },
    );

    return result;
  }
}
