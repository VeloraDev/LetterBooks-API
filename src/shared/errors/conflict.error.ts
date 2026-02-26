import { ApiError } from './api.error.js';

export class ConflictError extends ApiError {
  constructor(message?: string) {
    super(409, message ?? 'Conflict');
  }
}
