import type { IUserRepository } from 'src/modules/user/interfaces/user.repository.interface.js';
import { UserRepository } from 'src/modules/user/user.repository.js';
import { container } from 'tsyringe';

container.register<IUserRepository>('UserRepository', {
  useClass: UserRepository,
});
