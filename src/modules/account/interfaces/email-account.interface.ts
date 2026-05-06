export interface EmailAccount {
  id: string;
  userId: string;
  email: string;
  passwordHash: string;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
