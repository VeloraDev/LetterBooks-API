import { ApiError } from './api.error.js';

export class NotFoundError extends ApiError {
  constructor(code: string, message?: string) {
    super(404, code, message ?? 'Resource not found');
  }
}
