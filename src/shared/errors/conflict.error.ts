import { ApiError } from './api.error.js';

export class ConflictError extends ApiError {
  constructor(code: string, message?: string) {
    super(409, code, message ?? 'Conflict');
  }
}
