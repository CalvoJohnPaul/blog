import * as z from 'zod';
import {DateDefinition, IdDefinition} from './common';
import {UserDefinition} from './User';

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

export type UpdateCommentDataInput = z.infer<typeof UpdateCommentDataInputDefinition>;
export const UpdateCommentDataInputDefinition = z.object({
  content: CreateCommentInputDefinition.shape.content.optional().or(z.literal('')),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentInputDefinition>;
export const UpdateCommentInputDefinition = z.object({
  id: IdDefinition,
  data: UpdateCommentDataInputDefinition,
});
