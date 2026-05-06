import { EmailAccountResponseDto } from './dto/email-account-response.dto.js';
import { EmailAccount } from './interfaces/email-account.interface.js';

export function toEmailAccountResponse(
  data: EmailAccount,
): EmailAccountResponseDto {
  return {
    id: data.id,
    userId: data.userId,
    email: data.email,
    verifiedAt: data.verifiedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
