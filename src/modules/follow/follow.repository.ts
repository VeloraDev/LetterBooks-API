import { PrismaService } from 'src/shared/database/prisma.service.js';
import { inject, injectable } from 'tsyringe';
import { Follow } from './interfaces/follow.interface.js';
import { FollowSortBy, ListFollowsDto } from './follow.schema.js';
import {
  FollowOrderByWithRelationInput,
  FollowWhereInput,
} from 'src/generated/prisma/models.js';
import { User } from '../user/interfaces/user.interface.js';

@injectable()
export class FollowRepository {
  constructor(
    @inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async create(followerId: string, followingId: string): Promise<Follow> {
    return await this.prismaService.follow.create({
      data: { followerId, followingId },
    });
  }

  async findFollow(
    userId: string,
    followingId: string,
  ): Promise<Follow | null> {
    return this.prismaService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId,
        },
      },
    });
  }

  async findFollowersPaginated(
    userId: string,
    skip: number,
    data: ListFollowsDto,
  ): Promise<{ items: User[]; count: number }> {
    const where: FollowWhereInput = data.username
      ? {
          followingId: userId,
          follower: {
            username: { contains: data.username, mode: 'insensitive' },
          },
        }
      : {
          followingId: userId,
        };

    const [follows, count] = await Promise.all([
      this.prismaService.follow.findMany({
        skip,
        take: data.limit,
        where,

        include: {
          follower: true,
        },

        orderBy: orderByMap(data.sortBy),
      }),
      this.prismaService.follow.count({ where }),
    ]);

    return { items: follows.map((value) => value.follower), count };
  }

  async findFollowingPaginated(
    userId: string,
    skip: number,
    data: ListFollowsDto,
  ): Promise<{ items: User[]; count: number }> {
    const where: FollowWhereInput = data.username
      ? {
          followerId: userId,
          following: {
            username: {
              contains: data.username,
              mode: 'insensitive',
            },
          },
        }
      : {
          followerId: userId,
        };

    const [follows, count] = await Promise.all([
      this.prismaService.follow.findMany({
        skip,
        take: data.limit,
        where,

        include: {
          following: true,
        },

        orderBy: orderByMap(data.sortBy),
      }),
      this.prismaService.follow.count({ where }),
    ]);

    return { items: follows.map((value) => value.following), count };
  }

  async countFollowing(userId: string): Promise<number> {
    return this.prismaService.follow.count({ where: { followerId: userId } });
  }

  async countFollowers(userId: string): Promise<number> {
    return this.prismaService.follow.count({ where: { followingId: userId } });
  }

  async remove(followerId: string, followingId: string): Promise<boolean> {
    const result = await this.prismaService.follow.deleteMany({
      where: { followerId, followingId },
    });

    return result.count > 0;
  }
}

const orderByMap = (sortBy: FollowSortBy): FollowOrderByWithRelationInput => {
  switch (sortBy) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'newest':
      return { createdAt: 'desc' };
  }
};
