import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { ApiError } from 'src/shared/errors/api.error.js';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';
import type { User } from './interfaces/user.interface.js';

describe('UserService', () => {
  let repo: Mocked<UserRepository>;
  let userService: UserService;

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByUsername: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };
    userService = new UserService(repo);
  });

  describe('create', () => {
    it('should throw an error when username is already taken', async () => {
      repo.findByUsername.mockResolvedValue(makeUser({ username: 'user' }));

      await expect(userService.create({ username: 'user' })).rejects.toThrow(
        ApiError,
      );
    });

    it('should create an user successfully when the username is available', async () => {
      repo.findByUsername.mockResolvedValue(null);

      await userService.create({ username: 'user' });

      expect(repo.create).toHaveBeenCalledWith({ username: 'user' });
    });
  });

  describe('update', () => {
    it('should throw an error if the user was not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(
        userService.update('any-id', { username: 'new_username' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw an error if the username in update is already taken', async () => {
      repo.findById.mockResolvedValue(makeUser({ username: 'old_username' }));
      repo.findByUsername.mockResolvedValue(
        makeUser({ username: 'new_username' }),
      );

      await expect(
        userService.update('any-id', { username: 'new_username' }),
      ).rejects.toThrow(ApiError);
    });

    it('should update successfully when the username is available', async () => {
      repo.findById.mockResolvedValue(makeUser({ username: 'old_username' }));
      repo.findByUsername.mockResolvedValue(null);

      await userService.update('any=id', { username: 'new_username' });

      expect(repo.update).toHaveBeenCalledWith('any=id', {
        username: 'new_username',
      });
    });
  });

  describe('remove', () => {
    it('should throw an error if the user was not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(userService.remove('any-id')).rejects.toThrow(NotFoundError);
    });

    it('should remove successfully when the user was found', async () => {
      repo.findById.mockResolvedValue(makeUser());

      await userService.remove('any-id');

      expect(repo.remove).toHaveBeenCalledWith('any-id');
    });
  });
});

function makeUser(override?: Partial<User>): User {
  return {
    id: 'any-id',
    username: 'default',
    profileUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  };
}
