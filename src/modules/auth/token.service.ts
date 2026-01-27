import { injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

export type UserPayload = {
  id: string;
};

@injectable()
export class TokenService {
  async generateToken(payload: UserPayload): Promise<string> {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    } as jwt.SignOptions);
  }

  async verify(token: string): Promise<UserPayload> {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
  }
}
