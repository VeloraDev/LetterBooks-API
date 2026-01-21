import { describe, expect, it, vi, beforeEach, type Mocked } from 'vitest';
import type { EmailAccountRepository } from './email-account.repository.js';
import { EmailAccountService } from './email-account.service.js';
import type { EmailAccount } from './interfaces/email-account.interface.js';
import { ApiError } from 'src/shared/errors/api.error.js';
import { NotFoundError } from 'src/shared/errors/not-found.error.js';

describe('EmailAccountService', () => {
  let repo: Mocked<EmailAccountRepository>;
  let emailAccountService: EmailAccountService;

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    } as unknown as Mocked<EmailAccountRepository>;

    emailAccountService = new EmailAccountService(repo);
  });

  describe('create', () => {
    it('should throw an error when email is already taken', async () => {
      repo.findByEmail.mockResolvedValue(
        makeEmailAccount({ email: 'newuser@email.com' }),
      );

      await expect(
        emailAccountService.create({
          userId: 'user-id',
          email: 'newuser@email.com',
          passwordHash: 'hashed-password',
        }),
      ).rejects.toThrow(ApiError);
    });

    it('should crete an email account successfully when the email is available', async () => {
      repo.findByEmail.mockResolvedValue(null);

      await emailAccountService.create({
        userId: 'any-id',
        email: 'email@email.com',
        passwordHash: 'hashed-password',
      });

      expect(repo.create).toHaveBeenCalledWith(
        {
          userId: 'any-id',
          email: 'email@email.com',
          passwordHash: 'hashed-password',
        },
        undefined,
      );
    });
  });

  describe('update', () => {
    it('should throw an error if the email account was not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(
        emailAccountService.update('any-id', { email: 'newemail@email.com' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw an error when email in update is already taken', async () => {
      repo.findById.mockResolvedValue(
        makeEmailAccount({ id: 'any-id', email: 'oldemail@email.com' }),
      );
      repo.findByEmail.mockResolvedValue(
        makeEmailAccount({ email: 'newemail@email.com' }),
      );

      await expect(
        emailAccountService.update('any-id', { email: 'newemail@email.com' }),
      ).rejects.toThrow(ApiError);
    });

    it('should update successfully when the email is available', async () => {
      repo.findById.mockResolvedValue(
        makeEmailAccount({ id: 'any-id', email: 'oldemail@email.com' }),
      );
      repo.findByEmail.mockResolvedValue(null);

      await emailAccountService.update('any-id', {
        email: 'newemail@email.com',
      });

      expect(repo.update).toHaveBeenCalledWith('any-id', {
        email: 'newemail@email.com',
      });
    });
  });

  describe('remove', () => {
    it('should throw an error if the email account was not found', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(emailAccountService.remove('any-id')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should remove successfully when the email account was found', async () => {
      repo.findById.mockResolvedValue(makeEmailAccount({ id: 'any-id' }));

      await emailAccountService.remove('any-id');

      expect(repo.remove).toHaveBeenCalledWith('any-id');
    });
  });
});

function makeEmailAccount(override?: Partial<EmailAccount>): EmailAccount {
  return {
    id: 'any-id',
    userId: 'any-user-id',
    email: 'user@email.com',
    passwordHash: 'hashed-password',
    verifiedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  };
}
