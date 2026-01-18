import type { CreateUserDto } from '../dto/create-user.dto.js';
import type { UpdateUserDto } from '../dto/update-user.dto.js';
import type { User } from './user.interface.js';
import type { TransactionClient } from 'src/shared/database/transaction-client.js';

export interface IUserRepository {
  create(data: CreateUserDto, tx?: TransactionClient): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<void>;
}
