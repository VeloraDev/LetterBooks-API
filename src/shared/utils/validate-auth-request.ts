import type { Request } from 'express';
import { UnauthorizedError } from '../errors/unauthorized.error.js';
import type { UserPayload } from 'src/modules/auth/token.service.js';

export function validateAuthRequest(
  req: Request,
): asserts req is Request & { user: UserPayload } {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
}
