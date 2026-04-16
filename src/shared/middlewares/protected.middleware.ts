import { doubleCsrfProtection } from 'src/config/csrf.js';
import { authMiddleware } from 'src/modules/auth/middlewares/auth.middleware.js';

export const protectedMiddleware = [authMiddleware, doubleCsrfProtection];
