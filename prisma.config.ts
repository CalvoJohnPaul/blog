import {config} from 'dotenv';
import {defineConfig, env} from 'prisma/config';

config({
  path: '.env.local',
  debug: true,
  encoding: 'UTF8',
});

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
