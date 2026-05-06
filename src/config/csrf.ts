import { doubleCsrf } from 'csrf-csrf';
import { getCsrfSecret } from './constants.js';
import { baseCookiesConfig } from './cookies.js';

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => getCsrfSecret(),
  getSessionIdentifier: (req) => {
    return req.user!.id;
  },
  cookieName: 'csrf_secret',
  cookieOptions: {
    ...baseCookiesConfig,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});
