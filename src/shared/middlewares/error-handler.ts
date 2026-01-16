import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/api.error.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      timestamp: new Date().toISOString(),
      path: req.url,
      details: err.details,
    });
    return;
  }

  res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.url,
  });
  console.log(err);
}
