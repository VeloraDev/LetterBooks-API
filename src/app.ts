import Express from 'express';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import cookieParser from 'cookie-parser';

export function appFactory() {
  const app = Express();
  app.use(Express.json());
  app.use(cookieParser());

  app.use('/auth', authRouter);

  app.use(errorHandler);

  return app;
}
