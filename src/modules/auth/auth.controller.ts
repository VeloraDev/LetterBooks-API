import { inject, injectable } from 'tsyringe';
import { AuthService } from './auth.service.js';
import type { NextFunction, Request, Response } from 'express';
import { registerWithEmailSchema } from './schema/register-with-email.schema.js';
import { loginWithEmailSchema } from './schema/login-with-email.schema.js';
import { baseCookiesConfig } from 'src/config/cookies.js';
import { generateCsrfToken } from 'src/config/csrf.js';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  async registerByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerWithEmailSchema.parse(req.body);
      const account = await this.authService.registerWithEmail(data);

      res.status(201).json(account);
      return;
    } catch (error) {
      next(error);
    }
  }

  async loginByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginWithEmailSchema.parse(req.body);
      const token = await this.authService.loginEmail(data);

      res.cookie('token', token, {
        ...baseCookiesConfig,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }

  async getCsfrToken(req: Request, res: Response, next: NextFunction) {
    try {
      const csfrToken = generateCsrfToken(req, res);

      res.status(200).json({ csfrToken });
    } catch (error) {
      next(error);
    }
  }
}
