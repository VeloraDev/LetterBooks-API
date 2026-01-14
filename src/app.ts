import Express from 'express';
import { errorHandler } from './shared/middlewares/error-handler.js';

export function appFactory() {
  const app = Express();

  app.use(Express.json());

  app.use(errorHandler);

  return app;
}
