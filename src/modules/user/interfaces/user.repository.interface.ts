import type { CreateUserDto } from '../dto/create-user.dto.js';
import type { UpdateUserDto } from '../dto/update-user.dto.js';
import type { User } from './user.interface.js';

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<void>;
}
