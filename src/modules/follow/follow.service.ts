import { inject, injectable } from 'tsyringe';
import { FollowRepository } from './follow.repository.js';
import { UserService } from '../user/user.service.js';
import { ConflictError } from 'src/shared/errors/conflict.error.js';
import { ListFollowsDto } from './follow.schema.js';
import { User } from '../user/interfaces/user.interface.js';
import { OffsetPaginatedResult } from 'src/shared/types/offset-paginated-result.type.js';

type FollowStats = {
  following: number;
  followers: number;
};

@injectable()
export class FollowService {
  constructor(
    @inject(FollowRepository)
    private readonly followRepository: FollowRepository,
    @inject(UserService)
    private readonly userService: UserService,
  ) {}

  async follow(userId: string, followingId: string): Promise<FollowStats> {
    if (userId === followingId) {
      throw new ConflictError(
        'CANNOT_FOLLOW_YOURSELF',
        'Cannot follow yourself',
      );
    }

    await this.userService.findByIdOrThrow(followingId);

    const follow = await this.followRepository.findFollow(userId, followingId);
    if (follow) {
      throw new ConflictError(
        'ALREADY_FOLLOWING',
        'Already following this user',
      );
    }

    await this.followRepository.create(userId, followingId);

    return this.getFollowStats(followingId);
  }

  async unfollow(userId: string, followingId: string): Promise<FollowStats> {
    const result = await this.followRepository.remove(userId, followingId);
    if (!result) {
      throw new ConflictError(
        'NOT_FOLLOWING',
        'You are not following this user',
      );
    }

    return this.getFollowStats(followingId);
  }

  async removeFollower(
    userId: string,
    followerId: string,
  ): Promise<FollowStats> {
    const result = await this.followRepository.remove(followerId, userId);
    if (!result) {
      throw new ConflictError('NOT_FOLLOWER', 'The user is not a follower');
    }

    return this.getFollowStats(userId);
  }

  async followStatus(
    userId: string,
    followingId: string,
  ): Promise<{ isFollowing: boolean; isFollower: boolean }> {
    if (userId === followingId) {
      return { isFollowing: false, isFollower: false };
    }

    const [following, follower] = await Promise.all([
      this.followRepository.findFollow(userId, followingId),
      this.followRepository.findFollow(followingId, userId),
    ]);

    return {
      isFollowing: !!following,
      isFollower: !!follower,
    };
  }

  async listFollowers(
    userId: string,
    params: ListFollowsDto,
  ): Promise<OffsetPaginatedResult<User>> {
    const skip = (params.page - 1) * params.limit;
    const result = await this.followRepository.findFollowersPaginated(
      userId,
      skip,
      params,
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

  async listFollowing(
    userId: string,
    params: ListFollowsDto,
  ): Promise<OffsetPaginatedResult<User>> {
    const skip = (params.page - 1) * params.limit;
    const result = await this.followRepository.findFollowingPaginated(
      userId,
      skip,
      params,
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

  async countFollowing(userId: string): Promise<number> {
    return this.followRepository.countFollowing(userId);
  }

  async countFollowers(userId: string): Promise<number> {
    return this.followRepository.countFollowers(userId);
  }

  async getFollowStats(userId: string): Promise<FollowStats> {
    const [following, followers] = await Promise.all([
      this.countFollowing(userId),
      this.countFollowers(userId),
    ]);

    return {
      following,
      followers,
    };
  }
}
