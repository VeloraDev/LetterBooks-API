import { inject, injectable } from 'tsyringe';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';
import { UserRepository } from './user.repository.js';
import { ConflictError } from 'src/shared/errors/conflict.error.js';

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDto, tx?: TransactionClient) {
    await this.assertUsernameAvailable(data.username);
    return this.userRepository.create(data, tx);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async update(id: string, data: UpdateUserDto) {
    const userExist = await this.getUserOrThrow(id);
    if (data.username && data.username !== userExist.username) {
      await this.assertUsernameAvailable(data.username);
    }

    return this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.getUserOrThrow(id);
    await this.userRepository.remove(id);
  }

  private async getUserOrThrow(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User');

    return user;
  }

  private async assertUsernameAvailable(username: string) {
    const user = await this.userRepository.findByUsername(username);
    if (user) throw new ConflictError('Username already taken');
  }
}
