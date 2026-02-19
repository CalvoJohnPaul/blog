import {clamp} from 'es-toolkit';
import * as z from 'zod';
import {
  Date__QueryStringDefinition,
  DateDefinition,
  IdDefinition,
  Number__QueryStringDefinition,
  NumberArray__QueryStringDefinition,
  SortOrderDefinition,
  String__QueryStringDefinition,
  StringArray__QueryStringDefinition,
} from './common';

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

export type UsersInput = z.infer<typeof UsersInputDefinition>;
export const UsersInputDefinition = z
  .object({
    page: Number__QueryStringDefinition,
    pageSize: Number__QueryStringDefinition,
    id__eq: Number__QueryStringDefinition,
    id__neq: Number__QueryStringDefinition,
    id__in: NumberArray__QueryStringDefinition,
    id__nin: NumberArray__QueryStringDefinition,
    email__eq: String__QueryStringDefinition,
    email__neq: String__QueryStringDefinition,
    email__in: StringArray__QueryStringDefinition,
    email__nin: StringArray__QueryStringDefinition,
    email__contains: String__QueryStringDefinition,
    createdAt__gt: Date__QueryStringDefinition,
    createdAt__gte: Date__QueryStringDefinition,
    createdAt__lt: Date__QueryStringDefinition,
    createdAt__lte: Date__QueryStringDefinition,
    updatedAt__gt: Date__QueryStringDefinition,
    updatedAt__gte: Date__QueryStringDefinition,
    updatedAt__lt: Date__QueryStringDefinition,
    updatedAt__lte: Date__QueryStringDefinition,
    sortBy: z
      .enum(['createdAt', 'updatedAt'])
      .optional()
      .nullable()
      .catch('createdAt')
      .transform((v) => (v === null ? 'createdAt' : v)),
    sortOrder: SortOrderDefinition.optional()
      .nullable()
      .catch('DESC')
      .transform((v) => (v === null ? 'DESC' : v)),
  })
  .transform((v) => ({
    ...v,
    page: v.page != null ? clamp(v.page, 1, Number.MAX_SAFE_INTEGER) : 1,
    pageSize: v.pageSize != null ? clamp(v.pageSize, 1, 100) : 10,
  }));
