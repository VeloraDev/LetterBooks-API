import type { CreateEmailAccountDto } from './create-email-account.dto.js';

export type UpdateEmailAccountDto = Partial<CreateEmailAccountDto> & {
  verifiedAt?: Date;
};
