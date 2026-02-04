import {PrismaPg} from '@prisma/adapter-pg';
import {Prisma, PrismaClient} from '~/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({adapter}).$extends({
  model: {
    $allModels: {
      async exists<T>(this: T, where: Prisma.Args<T, 'findFirst'>['where']) {
        const context = Prisma.getExtensionContext(this) as any;
        const result = await context.findFirst({where});
        return result != null;
      },
    },
  },
});

export {prisma};
