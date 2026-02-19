import * as z from 'zod';
import {DateDefinition, IdDefinition} from './common';
import {UserDefinition} from './User';

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
  likesCount: z.number(),
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

export type UpdatePostDataInput = z.infer<typeof UpdatePostDataInputDefinition>;
export const UpdatePostDataInputDefinition = z.object({
  title: CreatePostInputDefinition.shape.title.optional().or(z.literal('')),
  description: CreatePostInputDefinition.shape.description.optional().or(z.literal('')),
  content: CreatePostInputDefinition.shape.content.optional().or(z.literal('')),
  tags: CreatePostInputDefinition.shape.tags.optional(),
});

export type UpdatePostInput = z.infer<typeof UpdatePostInputDefinition>;
export const UpdatePostInputDefinition = z.object({
  id: IdDefinition,
  data: UpdatePostDataInputDefinition,
});
