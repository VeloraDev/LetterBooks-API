import { Provider } from 'src/generated/prisma/enums.js';

export interface ProviderAccount {
  id: string;
  userId: string;
  providerId: string;
  provider: Provider;
  createdAt: Date;
  updatedAt: Date;
}
