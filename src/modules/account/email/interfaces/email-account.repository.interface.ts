import type { CreateEmailAccountDto } from '../dto/create-email-account.dto.js';
import type { UpdateEmailAccountDto } from '../dto/update-email-account.dto.js';
import type { EmailAccount } from './email-account.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

export interface IEmailAccountRepository {
  create(
    data: CreateEmailAccountDto,
    tx?: TransactionClient,
  ): Promise<EmailAccount>;
  findById(id: string): Promise<EmailAccount | null>;
  findByEmail(email: string): Promise<EmailAccount | null>;
  update(id: string, data: UpdateEmailAccountDto): Promise<EmailAccount>;
  remove(id: string): Promise<void>;
}
