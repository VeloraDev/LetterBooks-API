import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from 'src/config/constants.js';

export type UserPayload = {
  id: string;
};

@injectable()
export class TokenService {
  async generateToken(payload: UserPayload): Promise<string> {
    return jwt.sign(payload, getJwtSecret(), {
      expiresIn: '7d',
    } as jwt.SignOptions);
  }

  async verify(token: string): Promise<UserPayload> {
    return jwt.verify(token, getJwtSecret()) as UserPayload;
  }
}
