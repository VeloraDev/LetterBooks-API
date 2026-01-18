import Express from 'express';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { authRouter } from './modules/auth/auth.routes.js';

export function appFactory() {
  const app = Express();

  app.use(Express.json());

  app.use('/auth', authRouter);

  app.use(errorHandler);

  return app;
}
