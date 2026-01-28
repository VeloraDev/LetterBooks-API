import { inject, injectable } from 'tsyringe';
import { EmailAccountService } from '../account/email/email-account.service.js';
import type { RegisterWithEmailDto } from './dto/register-with-email.dto.js';
import { HashService } from 'src/shared/services/hash.service.js';
import type { RegisterWithEmailResponseDto } from './dto/register-with-email-response.dto.js';
import type { LoginWithEmailDto } from './dto/login-with-email.dto.js';
import { TokenService } from './token.service.js';
import { UnauthorizedError } from 'src/shared/errors/unauthorized.error.js';

@injectable()
export class AuthService {
  constructor(
    @inject(EmailAccountService)
    private readonly emailAccountService: EmailAccountService,
    @inject(HashService)
    private readonly hashService: HashService,
    @inject(TokenService)
    private readonly tokenService: TokenService,
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

  async loginEmail(data: LoginWithEmailDto) {
    const account = await this.emailAccountService.getByEmail(data.email);
    if (!account) throw new UnauthorizedError('Invalid credentials');

    const verify = await this.hashService.compare(
      data.password,
      account.passwordHash,
    );
    if (!verify) throw new UnauthorizedError('Invalid credentials');

    return this.tokenService.generateToken({
      id: account.userId,
    });
  }
}
