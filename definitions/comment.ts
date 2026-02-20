import {clamp} from 'es-toolkit';
import * as z from 'zod';
import {
  Date__QueryStringDefinition,
  DateDefinition,
  IdDefinition,
  Number__QueryStringDefinition,
  NumberArray__QueryStringDefinition,
} from './common';
import {UserDefinition} from './user';

export type Comment = z.infer<typeof CommentDefinition>;
export const CommentDefinition = z.object({
  id: IdDefinition,
  user: UserDefinition.pick({
    id: true,
    name: true,
    image: true,
  }),
  postId: IdDefinition,
  content: z.string(),
  createdAt: DateDefinition,
  updatedAt: DateDefinition,
});

export type CreateCommentInput = z.infer<typeof CreateCommentInputDefinition>;
export const CreateCommentInputDefinition = z.object({
  content: z.string().trim().min(4, 'Content too short').max(250, 'Content too long'),
  postId: IdDefinition,
  userId: IdDefinition,
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentInputDefinition>;
export const UpdateCommentInputDefinition = z.object({
  content: CreateCommentInputDefinition.shape.content.optional().or(z.literal('')),
});

export type CommentsInput = z.infer<typeof CommentsInputDefinition>;
export const CommentsInputDefinition = z
  .object({
    page: Number__QueryStringDefinition,
    pageSize: Number__QueryStringDefinition,
    id__eq: Number__QueryStringDefinition,
    id__neq: Number__QueryStringDefinition,
    id__in: NumberArray__QueryStringDefinition,
    id__nin: NumberArray__QueryStringDefinition,
    postId__eq: Number__QueryStringDefinition,
    postId__neq: Number__QueryStringDefinition,
    postId__in: NumberArray__QueryStringDefinition,
    postId__nin: NumberArray__QueryStringDefinition,
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
  })
  .partial()
  .transform((v) => ({
    ...v,
    page: clamp(v.page ?? 1, 1, Number.MAX_SAFE_INTEGER),
    pageSize: clamp(v.pageSize ?? 10, 1, 100),
  }));
