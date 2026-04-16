import express from 'express';
import { container } from 'tsyringe';
import { UserController } from './user.controller.js';
import { authMiddleware } from '../auth/middlewares/auth.middleware.js';
import { protectedMiddleware } from 'src/shared/middlewares/protected.middleware.js';

const userRouter = express.Router();
const userController = container.resolve(UserController);

userRouter.get('/', userController.listUsers.bind(userController));
userRouter.get(
  '/me',
  authMiddleware,
  userController.getMe.bind(userController),
);
userRouter.patch(
  '/me',
  protectedMiddleware,
  userController.update.bind(userController),
);
userRouter.delete(
  '/me',
  protectedMiddleware,
  userController.remove.bind(userController),
);

export { userRouter };
