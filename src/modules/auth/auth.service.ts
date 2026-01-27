import { inject, injectable } from 'tsyringe';
import { EmailAccountService } from '../account/email/email-account.service.js';
import type { RegisterWithEmailDto } from './dto/register-with-email.dto.js';
import { HashService } from 'src/shared/services/hash.service.js';
import type { RegisterWithEmailResponseDto } from './dto/register-with-email-response.dto.js';

@injectable()
export class AuthService {
  constructor(
    @inject(EmailAccountService)
    private readonly emailAccountService: EmailAccountService,
    @inject(HashService)
    private readonly hashService: HashService,
  ) {}

  async registerWithEmail(
    data: RegisterWithEmailDto,
  ): Promise<RegisterWithEmailResponseDto> {
    const result = await this.emailAccountService.createAccountWithUser(data);

    return {
      id: result.user.id,
      username: result.user.username,
      email: result.account.email,
      emailVerified: !!result.account.verifiedAt,
      createdAt: result.user.createdAt,
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
      user,
      emailAccount,
    };
  }
}
