import { inject, injectable } from 'tsyringe';
import { HashService } from 'src/shared/services/hash.service.js';
import { TokenService } from './token.service.js';
import { UnauthorizedError } from 'src/shared/errors/unauthorized.error.js';
import { LoginWithEmailDto, RegisterWithEmailDto } from './auth.schema.js';
import { AccountService } from '../account/account.service.js';
import { PrismaService } from 'src/shared/database/prisma.service.js';
import { UserService } from '../user/user.service.js';
import { User } from '../user/interfaces/user.interface.js';
import { EmailAccountResponseDto } from '../account/dto/email-account-response.dto.js';

@injectable()
export class AuthService {
  constructor(
    @inject(AccountService)
    private readonly accountService: AccountService,
    @inject(PrismaService)
    private readonly prismaService: PrismaService,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(HashService)
    private readonly hashService: HashService,
    @inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async registerWithEmail(
    data: RegisterWithEmailDto,
  ): Promise<{ user: User; emailAccount: EmailAccountResponseDto }> {
    const userWithAccount = await this.prismaService.$transaction(
      async (tx) => {
        const user = await this.userService.create(
          { username: data.username },
          tx,
        );

        const emailAccount = await this.accountService.createEmailAccount(
          user.id,
          { email: data.email, password: data.password },
          tx,
        );

        return { user, emailAccount };
      },
    );

    return userWithAccount;
  }

  async loginEmail(data: LoginWithEmailDto): Promise<string> {
    const account = await this.accountService.getEmailAccountByEmail(
      data.email,
    );
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
