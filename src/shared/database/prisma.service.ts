import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from 'src/config/constants.js';
import { PrismaClient } from 'src/generated/prisma/client.js';

export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: DATABASE_URL,
    });
    super({ adapter });
  }
}
