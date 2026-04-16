import { inject, injectable } from 'tsyringe';
import { UserService } from './user.service.js';
import { NextFunction, Request, Response } from 'express';
import { updateUserSchema } from './schema/update-user.schema.js';
import { listUsersSchema } from './schema/list-users.schema.js';

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const params = listUsersSchema.parse(req.query);
      const users = await this.userService.listUsers(params);

      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findByIdOrThrow(req.user!.id);

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateUserSchema.parse(req.body);
      const updated = await this.userService.update(req.user!.id, data);

      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.remove(req.user!.id);

      res.clearCookie('token');
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}
