import { inject, injectable } from 'tsyringe';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';
import { UserRepository } from './user.repository.js';
import { ConflictError } from 'src/shared/errors/conflict.error.js';
import { User } from './interfaces/user.interface.js';
import { TransactionClient } from 'src/shared/database/transaction-client.js';
import { CreateUserDto, ListUsersDto, UpdateUserDto } from './user.schema.js';
import { OffsetPaginatedResult } from 'src/shared/types/offset-paginated-result.type.js';

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDto, tx?: TransactionClient): Promise<User> {
    await this.assertUsernameAvailable(data.username);
    return this.userRepository.create(data, tx);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async listUsers(params: ListUsersDto): Promise<OffsetPaginatedResult<User>> {
    const skip = (params.page - 1) * params.limit;
    const result = await this.userRepository.findUsersPaginated(
      params.limit,
      params.sortBy,
      skip,
      params.username,
    );

    const totalPages = Math.ceil(result.count / params.limit);

    return {
      data: result.items,
      page: params.page,
      limit: params.limit,
      total: result.count,
      totalPages,
    };
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const userExist = await this.findByIdOrThrow(id);
    if (data.username && data.username !== userExist.username) {
      await this.assertUsernameAvailable(data.username);
    }

    return this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.userRepository.remove(id);
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('User');

    return user;
  }

  private async assertUsernameAvailable(username: string): Promise<void> {
    const user = await this.userRepository.findByUsername(username);
    if (user) throw new ConflictError('Username already taken');
  }
}
