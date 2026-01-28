import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from './auth.controller.js';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post(
  '/email/register',
  authController.registerByEmail.bind(authController),
);
authRouter.post(
  '/email/login',
  authController.loginByEmail.bind(authController),
);

export { authRouter };
