import { Request, Response } from 'express';

export function sendError(
  req: Request,
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return res.status(statusCode).json({
    statusCode,
    code,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
    ...(details != undefined && { details }),
  });
}
