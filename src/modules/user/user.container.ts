import { container } from 'tsyringe';
import type { IUserRepository } from './interfaces/user.repository.interface.js';
import { UserRepository } from './user.repository.js';

container.register<IUserRepository>('UserRepository', {
  useClass: UserRepository,
});
