import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { FollowService } from './follow.service.js';
import { UserService } from '../user/user.service.js';
import { FollowRepository } from './follow.repository.js';
import { ConflictError } from 'src/shared/errors/conflict.error.js';

describe('FollowService', () => {
  let followRepository: Mocked<FollowRepository>;
  let userService: Mocked<UserService>;
  let followService: FollowService;

  beforeEach(() => {
    followRepository = {
      countFollowers: vi.fn(),
      countFollowing: vi.fn(),
      create: vi.fn(),
      findFollow: vi.fn(),
      findFollowersPaginated: vi.fn(),
      findFollowingPaginated: vi.fn(),
      remove: vi.fn(),
    } as unknown as Mocked<FollowRepository>;

    userService = {
      findByIdOrThrow: vi.fn(),
    } as unknown as Mocked<UserService>;

    followService = new FollowService(followRepository, userService);
  });

  describe('follow', () => {
    it('should throw an error when following yourself', async () => {
      await expect(followService.follow('userId', 'userId')).rejects.toThrow(
        ConflictError,
      );
    });

    it('should throw an error if already following the user', async () => {
      followRepository.findFollow.mockResolvedValue({
        id: 'any',
        followerId: 'userId',
        followingId: 'targetId',
      });

      await expect(followService.follow('userId', 'targetId')).rejects.toThrow(
        ConflictError,
      );
    });

    it('should follow an user successfully', async () => {
      followRepository.findFollow.mockResolvedValue(null);

      await followService.follow('userId', 'targetId');

      expect(followRepository.create).toHaveBeenCalledWith(
        'userId',
        'targetId',
      );
    });
  });

  describe('unfollow', () => {
    it('should throw an error if the target user is not followed', async () => {
      followRepository.remove.mockResolvedValue(false);

      await expect(
        followService.unfollow('userId', 'targetId'),
      ).rejects.toThrow(ConflictError);
    });

    it('should unfollow an user successfully', async () => {
      followRepository.remove.mockResolvedValue(true);

      await followService.unfollow('userId', 'targetId');

      expect(followRepository.remove).toHaveBeenCalledWith(
        'userId',
        'targetId',
      );
    });
  });

  describe('removeFollower', () => {
    it('should throw an error if the user is not a follower', async () => {
      followRepository.remove.mockResolvedValue(false);

      await expect(
        followService.removeFollower('userId', 'targetId'),
      ).rejects.toThrow(ConflictError);
    });

    it('should remove a follower successfully', async () => {
      followRepository.remove.mockResolvedValue(true);

      await followService.removeFollower('userId', 'targetId');

      expect(followRepository.remove).toHaveBeenCalledWith(
        'targetId',
        'userId',
      );
    });
  });
});
