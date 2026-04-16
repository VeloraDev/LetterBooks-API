import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/api.error.js';
import { flattenError, ZodError } from 'zod';
import { sendError } from '../utils/send-error.js';

export function errorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof ApiError) {
    return sendError(req, res, err.statusCode, err.message);
  }

  if (err?.code === 'EBADCSRFTOKEN') {
    return sendError(req, res, 403, 'Invalid CSRF Token');
  }

  if (err instanceof ZodError) {
    return sendError(req, res, 400, 'Invalid data send', flattenError(err));
  }

  console.log(err);
  return sendError(req, res, 500, 'Internal server error');
}
