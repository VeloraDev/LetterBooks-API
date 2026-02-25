import type { EmailAccountResponseDto } from './dto/email-account-response.dto.js';
import type { EmailAccount } from './interfaces/email-account.interface.js';

export function toEmailAccountResponse(
  emailAccount: EmailAccount,
): EmailAccountResponseDto {
  return {
    id: emailAccount.id,
    email: emailAccount.email,
    emailVerified: !!emailAccount.verifiedAt,
    createdAt: emailAccount.createdAt,
    updatedAt: emailAccount.updatedAt,
  };
}
