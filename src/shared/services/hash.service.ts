import { injectable } from 'tsyringe';
import * as argon2 from 'argon2';

@injectable()
export class HashService {
  async hash(value: string) {
    return argon2.hash(value);
  }

  async compare(value: string, hash: string) {
    return argon2.verify(hash, value);
  }
}
