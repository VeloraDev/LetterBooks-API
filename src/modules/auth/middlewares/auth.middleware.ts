import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'src/shared/errors/unauthorized.error.js';
import { container } from 'tsyringe';
import { TokenService } from '../token.service.js';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token: string = req.cookies['token'];
  if (!token) throw new UnauthorizedError('AUTH_REQUIRED', 'Auth requrired');

  try {
    const tokenService = container.resolve(TokenService);
    const decoded = await tokenService.verify(token);

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('INVALID_AUTH', 'Invalid auth credentials');
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('AUTH_EXPIRED', 'Session expired');
    }

    next(error);
  }
}
