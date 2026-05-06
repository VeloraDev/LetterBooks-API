import { PrismaService } from 'src/shared/database/prisma.service.js';
import { inject, injectable } from 'tsyringe';
import { ProviderAccount } from '../interfaces/provider-account.interface.js';

@injectable()
export class ProviderAccountRepository {
  constructor(
    @inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async findByUserId(userId: string): Promise<ProviderAccount[]> {
    return this.prismaService.providerAccount.findMany({ where: { userId } });
  }
}
