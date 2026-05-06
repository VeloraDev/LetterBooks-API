import { inject, injectable } from 'tsyringe';
import { NextFunction, Request, Response } from 'express';
import { AccountService } from './account.service.js';

@injectable()
export class AccountController {
  constructor(
    @inject(AccountService)
    private readonly accountService: AccountService,
  ) {}

  async showAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userWithAccounts = await this.accountService.findAccounts(
        req.user!.id,
      );

      res.status(200).json(userWithAccounts);
      return;
    } catch (error) {
      next(error);
    }
  }
}
