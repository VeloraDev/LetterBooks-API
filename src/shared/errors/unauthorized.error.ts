import { ApiError } from './api.error.js';

export class UnauthorizedError extends ApiError {
  constructor(code: string, message?: string) {
    super(401, code, message ?? 'Unauthorized');
  }
}
