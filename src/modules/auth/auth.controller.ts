import { inject, injectable } from 'tsyringe';
import { AuthService } from './auth.service.js';
import type { NextFunction, Request, Response } from 'express';
import { validate } from 'src/shared/utils/validate.js';
import { registerWithEmailSchema } from './schema/register-with-email.schema.js';
import { loginWithEmailSchema } from './schema/login-with-email.schema.js';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  async registerByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(registerWithEmailSchema, req.body);
      const account = await this.authService.registerWithEmail(data);

      res.status(201).json(account);
      return;
    } catch (error) {
      next(error);
    }
  }

  async loginByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = validate(loginWithEmailSchema, req.body);
      const token = await this.authService.loginEmail(data);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }
}
