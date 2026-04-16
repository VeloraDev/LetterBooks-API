import { inject, injectable } from 'tsyringe';
import { UserService } from '../user/user.service.js';
import { NextFunction, Request, Response } from 'express';

@injectable()
export class AccountController {
  constructor(
    @inject(UserService)
    private readonly userService: UserService,
  ) {}

  async showAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userWithAccounts = await this.userService.findWithAccounts(
        req.user!.id,
      );

      res.status(200).json(userWithAccounts);
      return;
    } catch (error) {
      next(error);
    }
  }
}
