import {clamp} from 'es-toolkit';
import * as z from 'zod';
import {
  Date__QueryStringDefinition,
  DateDefinition,
  IdDefinition,
  Number__QueryStringDefinition,
  NumberArray__QueryStringDefinition,
  String__QueryStringDefinition,
  StringArray__QueryStringDefinition,
} from './common';
import {UserDefinition} from './user';

export type Post = z.infer<typeof PostDefinition>;
export const PostDefinition = z.object({
  id: IdDefinition,
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  user: UserDefinition.pick({
    id: true,
    name: true,
    image: true,
  }),
  favouritedBy: z.array(z.number()),
  favouritesCount: z.number(),
  commentsCount: z.number(),
  createdAt: DateDefinition,
  updatedAt: DateDefinition,
});

export type CreatePostInput = z.infer<typeof CreatePostInputDefinition>;
export const CreatePostInputDefinition = z.object({
  title: z.string().trim().min(4, 'Title too short').max(100, 'Title too long'),
  description: z.string().trim().min(4, 'Description too short').max(250, 'Description too long'),
  content: z.string(),
  tags: z
    .array(z.string().trim().min(1, 'Tag too short').max(25, 'Tag too long'))
    .max(5, 'Too many tags'),
  userId: IdDefinition,
});

export type PostsInput = z.infer<typeof PostsInputDefinition>;
export const PostsInputDefinition = z
  .object({
    page: Number__QueryStringDefinition,
    pageSize: Number__QueryStringDefinition,
    id__eq: Number__QueryStringDefinition,
    id__neq: Number__QueryStringDefinition,
    id__in: NumberArray__QueryStringDefinition,
    id__nin: NumberArray__QueryStringDefinition,
    slug__eq: String__QueryStringDefinition,
    slug__neq: String__QueryStringDefinition,
    slug__in: StringArray__QueryStringDefinition,
    slug__nin: StringArray__QueryStringDefinition,
    slug__contains: String__QueryStringDefinition,
    userId__eq: Number__QueryStringDefinition,
    userId__neq: Number__QueryStringDefinition,
    userId__in: NumberArray__QueryStringDefinition,
    userId__nin: NumberArray__QueryStringDefinition,
    createdAt__gt: Date__QueryStringDefinition,
    createdAt__gte: Date__QueryStringDefinition,
    createdAt__lt: Date__QueryStringDefinition,
    createdAt__lte: Date__QueryStringDefinition,
    updatedAt__gt: Date__QueryStringDefinition,
    updatedAt__gte: Date__QueryStringDefinition,
    updatedAt__lt: Date__QueryStringDefinition,
    updatedAt__lte: Date__QueryStringDefinition,
    tag__has: String__QueryStringDefinition,
    favourites__has: Number__QueryStringDefinition,
  })
  .partial()
  .transform((v) => ({
    ...v,
    page: clamp(v.page ?? 1, 1, Number.MAX_SAFE_INTEGER),
    pageSize: clamp(v.pageSize ?? 5, 1, 100),
  }));
