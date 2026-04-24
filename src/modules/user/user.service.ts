import { inject, injectable } from 'tsyringe';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';
import { UserRepository } from './user.repository.js';
import { ConflictError } from 'src/shared/errors/conflict.error.js';
import { toEmailAccountResponse } from '../account/email/email-account.mapper.js';
import { User } from './interfaces/user.interface.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { TransactionClient } from 'src/shared/database/transaction-client.js';
import { UpdateUserDto } from './user.schema.js';

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

  async findWithAccounts(id: string) {
    const user = await this.userRepository.findWithAccounts(id);
    if (!user) throw new NotFoundError('User');

    return {
      ...user,
      emailAccount: user.emailAccount
        ? toEmailAccountResponse(user.emailAccount)
        : null,
    };
  }

  async listUsers(params: {
    limit: number;
    cursor?: string;
    username?: string;
  }) {
    const users = await this.userRepository.findUsers(
      params.limit,
      params.cursor,
      params.username,
    );

    const hasNextPage = users.length > params.limit;
    const data = hasNextPage ? users.slice(0, -1) : users;

    return {
      data,
      nextCursor: hasNextPage ? users[users.length - 1].id : null,
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
