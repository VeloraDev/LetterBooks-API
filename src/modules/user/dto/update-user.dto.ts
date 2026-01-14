import type { CreateUserDto } from './create-user.dto.js';

export type UpdateUserDto = Partial<CreateUserDto> & {
  profileUrl?: string;
};
