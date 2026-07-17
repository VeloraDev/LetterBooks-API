import { inject, injectable } from 'tsyringe';
import { FollowService } from './follow.service.js';
import { NextFunction, Request, Response } from 'express';
import { idSchema, listFollowsSchema } from './follow.schema.js';

@injectable()
export class FollowController {
  constructor(
    @inject(FollowService) private readonly followService: FollowService,
  ) {}

  async follow(req: Request, res: Response, next: NextFunction) {
    try {
      const followingId = idSchema.parse(req.params.userId);
      const data = await this.followService.follow(req.user!.id, followingId);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req: Request, res: Response, next: NextFunction) {
    try {
      const followingId = idSchema.parse(req.params.userId);
      const data = await this.followService.unfollow(req.user!.id, followingId);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async removeFollower(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = idSchema.parse(req.params.userId);
      const data = await this.followService.removeFollower(
        req.user!.id,
        followerId,
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async isFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const followingId = idSchema.parse(req.params.userId);
      const data = await this.followService.followStatus(
        req.user!.id,
        followingId,
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async listFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = idSchema.parse(req.params.userId);
      const params = listFollowsSchema.parse(req.query);
      const data = await this.followService.listFollowers(userId, params);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async listFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = idSchema.parse(req.params.userId);
      const params = listFollowsSchema.parse(req.query);
      const data = await this.followService.listFollowing(userId, params);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
