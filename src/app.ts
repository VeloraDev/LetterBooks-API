import Express from 'express';

export function appFactory() {
  const app = Express();

  return app;
}
