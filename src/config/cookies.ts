import { CookieOptions } from 'express';

export const baseCookiesConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
};
