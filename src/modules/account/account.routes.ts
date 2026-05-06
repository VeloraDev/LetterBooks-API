import { Router } from 'express';
import { container } from 'tsyringe';
import { AccountController } from './account.controller.js';
import { authMiddleware } from '../auth/middlewares/auth.middleware.js';

const accountRouter = Router();

const accountController = container.resolve(AccountController);

accountRouter.use(authMiddleware);
accountRouter.get('/', accountController.showAccounts.bind(accountController));
accountRouter.delete(
  '/email',
  accountController.removeEmailAccount.bind(accountController),
);

export { accountRouter };
