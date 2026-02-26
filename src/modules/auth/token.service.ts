import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config/constants.js';

export type UserPayload = {
  id: string;
};

@injectable()
export class TokenService {
  async generateToken(payload: UserPayload): Promise<string> {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    } as jwt.SignOptions);
  }

  async verify(token: string): Promise<UserPayload> {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  }
}
