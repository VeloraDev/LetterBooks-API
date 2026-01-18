import { container } from 'tsyringe';
import type { IEmailAccountRepository } from './interfaces/email-account.repository.interface.js';
import { EmailAccountRepository } from './email-account.repository.js';

container.register<IEmailAccountRepository>('EmailAccountRepository', {
  useClass: EmailAccountRepository,
});
