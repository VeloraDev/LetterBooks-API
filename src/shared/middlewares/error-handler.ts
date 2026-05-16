import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/api.error.js';
import { ZodError } from 'zod';
import { sendError } from '../utils/send-error.js';

export function errorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof ApiError) {
    return sendError(req, res, err.statusCode, err.code, err.message);
  }

  if (err?.code === 'EBADCSRFTOKEN') {
    return sendError(req, res, 403, 'INVALID_CSRF_TOKEN', 'Invalid CSRF Token');
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};

    err.issues.forEach((error) => {
      const field = error.path.length > 0 ? error.path.join('.') : 'formError';
      if (!errors[field]) {
        errors[field] = [];
      }

      errors[field].push(error.message);
    });

    return sendError(
      req,
      res,
      400,
      'VALIDATION_ERROR',
      'Invalid data send',
      errors,
    );
  }

  console.log(err);
  return sendError(
    req,
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    'Internal server error',
  );
}
