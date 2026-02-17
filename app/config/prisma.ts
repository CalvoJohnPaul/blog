import {withAccelerate} from '@prisma/extension-accelerate';
import assert from 'node:assert';
import {Prisma, PrismaClient} from '~/generated/prisma/client';

const accelerateUrl = process.env.DATABASE_URL;

assert(accelerateUrl);

const prisma = new PrismaClient({accelerateUrl}).$extends(withAccelerate()).$extends({
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
