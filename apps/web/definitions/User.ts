import * as z from 'zod';
import {DateDefinition, IdDefinition} from './common';

export type User = z.infer<typeof UserDefinition>;
export const UserDefinition = z.object({
  id: IdDefinition,
  bio: z.string(),
  name: z.string(),
  email: z.email(),
  image: z.url(),
  createdAt: DateDefinition,
  updatedAt: DateDefinition,
});

export type CreateUserInput = z.infer<typeof CreateUserInputDefinition>;
export const CreateUserInputDefinition = z.object({
  bio: z.string().trim().min(4, 'Bio too short').max(250, 'Bio too long').or(z.literal('')),
  name: z.string().trim().min(4, 'Name too short').max(50, 'Name too long'),
  email: z.email().max(150, 'Email too long'),
  image: z.url().max(150, 'Image URL too long').or(z.literal('')),
  password: z.string().trim().min(8, 'Password too short').max(100, 'Password too long'),
});

export type UpdateUserDataInput = z.infer<typeof UpdateUserDataInputDefinition>;
export const UpdateUserDataInputDefinition = z.object({
  bio: CreateUserInputDefinition.shape.bio.optional(),
  name: CreateUserInputDefinition.shape.name.optional().or(z.literal('')),
  email: CreateUserInputDefinition.shape.email.optional().or(z.literal('')),
  image: CreateUserInputDefinition.shape.image.optional(),
  password: CreateUserInputDefinition.shape.password.optional().or(z.literal('')),
});

export type UpdateUserInput = z.infer<typeof UpdateUserInputDefinition>;
export const UpdateUserInputDefinition = z.object({
  id: IdDefinition,
  data: UpdateUserDataInputDefinition,
});
