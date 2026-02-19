import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '~/.generated/prisma/client';

const g = global as unknown as {prisma: PrismaClient};
const p = process.env.NODE_ENV === 'production';

const prisma =
  g.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
  });

if (!p) g.prisma = prisma;

export {prisma};
