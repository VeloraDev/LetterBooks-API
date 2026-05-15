import express from 'express';
import { authMiddleware } from '../auth/middlewares/auth.middleware.js';
import { container } from 'tsyringe';
import { FollowController } from './follow.controller.js';
import { protectedMiddleware } from 'src/shared/middlewares/protected.middleware.js';

const followController = container.resolve(FollowController);
const followRouter = express.Router();

followRouter.post(
  '/:userId/follow',
  protectedMiddleware,
  followController.follow.bind(followController),
);
followRouter.delete(
  '/:userId/follow',
  protectedMiddleware,
  followController.unfollow.bind(followController),
);
followRouter.delete(
  '/:userId/followers',
  protectedMiddleware,
  followController.removeFollower.bind(followController),
);
followRouter.get(
  '/:userId/follow-status',
  authMiddleware,
  followController.isFollowing.bind(followController),
);
followRouter.get(
  '/:userId/followers',
  followController.listFollowers.bind(followController),
);
followRouter.get(
  '/:userId/following',
  followController.listFollowing.bind(followController),
);

export { followRouter };
