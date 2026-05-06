import { EmailAccount } from '../interfaces/email-account.interface.js';

export type EmailAccountResponseDto = Omit<EmailAccount, 'passwordHash'>;
