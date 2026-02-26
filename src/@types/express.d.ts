import type { UserPayload } from 'src/modules/auth/token.service.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
