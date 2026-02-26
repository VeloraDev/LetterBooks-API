import { ApiError } from './api.error.js';

export class UnauthorizedError extends ApiError {
  constructor(message?: string) {
    super(401, message ?? 'unauthorized');
  }
}
