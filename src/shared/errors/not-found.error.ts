import { ApiError } from './api.error.js';

export class NotFoundError extends ApiError {
  constructor(public readonly resource?: string) {
    super(404, `${resource ?? 'Resource'} not found`);
  }
}
