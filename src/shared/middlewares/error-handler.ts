import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/api.error.js';
import { flattenError, ZodError } from 'zod';
import { sendError } from '../utils/send-error.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof ApiError) {
    return sendError(req, res, err.statusCode, err.message);
  }

  if (err instanceof ZodError) {
    return sendError(req, res, 400, 'Invalid data send', flattenError(err));
  }

  console.log(err);
  return sendError(req, res, 500, 'Internal server error');
}
