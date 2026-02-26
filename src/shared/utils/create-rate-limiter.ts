import rateLimit from 'express-rate-limit';
import { ApiError } from '../errors/api.error.js';

export function createRateLimiter(limit: number, windowMinutes: number) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    handler: (req, res, next) =>
      next(new ApiError(429, 'Too many requests, try again later')),
  });
}
