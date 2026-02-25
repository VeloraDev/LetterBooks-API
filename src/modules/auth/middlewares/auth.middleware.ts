import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'src/shared/errors/unauthorized.error.js';
import { container } from 'tsyringe';
import { TokenService } from '../token.service.js';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token: string = req.cookies['token'];
    if (!token) throw new UnauthorizedError();

    const tokenService = container.resolve(TokenService);
    const decoded = await tokenService.verify(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}
