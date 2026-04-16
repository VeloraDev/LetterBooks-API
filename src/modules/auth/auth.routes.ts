import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from './auth.controller.js';
import { createRateLimiter } from 'src/shared/utils/create-rate-limiter.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

const authRouter = Router();
const authController = container.resolve(AuthController);

const loginLimiter = createRateLimiter(5, 10);
const registerLimiter = createRateLimiter(15, 10);

authRouter.post(
  '/email/register',
  registerLimiter,
  authController.registerByEmail.bind(authController),
);
authRouter.post(
  '/email/login',
  loginLimiter,
  authController.loginByEmail.bind(authController),
);
authRouter.get(
  '/csfr',
  authMiddleware,
  authController.getCsfrToken.bind(authController),
);

export { authRouter };
