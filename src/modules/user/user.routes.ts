import express from 'express';
import { container } from 'tsyringe';
import { UserController } from './user.controller.js';
import { authMiddleware } from '../auth/middlewares/auth.middleware.js';

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
  authMiddleware,
  userController.update.bind(userController),
);
userRouter.delete(
  '/me',
  authMiddleware,
  userController.remove.bind(userController),
);

export { userRouter };
