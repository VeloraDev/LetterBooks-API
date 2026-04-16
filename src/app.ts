import Express from 'express';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import cookieParser from 'cookie-parser';
import { accountRouter } from './modules/account/account.routes.js';
import { createRateLimiter } from './shared/utils/create-rate-limiter.js';
import { userRouter } from './modules/user/user.routes.js';
import helmet from 'helmet';

export function appFactory() {
  const app = Express();

  app.use(helmet());
  app.use(Express.json());
  app.use(cookieParser());
  app.use(createRateLimiter(200, 15));

  app.use('/auth', authRouter);
  app.use('/accounts', accountRouter);
  app.use('/users', userRouter);

  app.use(errorHandler);

  return app;
}
