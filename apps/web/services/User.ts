import {hash} from 'bcrypt';
import {clamp} from 'es-toolkit';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import type {Paginated} from '~/definitions/common';
import type {CreateUserInput, UpdateUserInput, User, UsersInput} from '~/definitions/User';

export async function getUsers(input?: UsersInput): Promise<Paginated<User>> {
  const page = clamp(input?.page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const take = clamp(input?.pageSize ?? 10, 10, 100);
  const skip = (page - 1) * take;

  const where: Prisma.UserWhereInput = {};

  if (
    input?.id__eq != null ||
    input?.id__neq != null ||
    input?.id__in != null ||
    input?.id__nin != null
  ) {
    where.id = {
      ...(input.id__eq != null ? {equals: input.id__eq} : {}),
      ...(input.id__neq != null ? {not: input.id__neq} : {}),
      ...(input.id__in != null ? {in: input.id__in} : {}),
      ...(input.id__nin != null ? {notIn: input.id__nin} : {}),
    };
  }

  if (
    input?.email__eq != null ||
    input?.email__neq != null ||
    input?.email__in != null ||
    input?.email__nin != null ||
    input?.email__contains != null
  ) {
    where.email = {
      ...(input.email__eq != null ? {equals: input.email__eq} : {}),
      ...(input.email__neq != null ? {not: input.email__neq} : {}),
      ...(input.email__in != null ? {in: input.email__in} : {}),
      ...(input.email__nin != null ? {notIn: input.email__nin} : {}),
      ...(input.email__contains != null
        ? {contains: input.email__contains, mode: 'insensitive'}
        : {}),
    };
  }

  if (
    input?.createdAt__gt != null ||
    input?.createdAt__gte != null ||
    input?.createdAt__lt != null ||
    input?.createdAt__lte != null
  ) {
    where.createdAt = {
      ...(input.createdAt__gt != null ? {gt: input.createdAt__gt} : {}),
      ...(input.createdAt__gte != null ? {gte: input.createdAt__gte} : {}),
      ...(input.createdAt__lt != null ? {lt: input.createdAt__lt} : {}),
      ...(input.createdAt__lte != null ? {lte: input.createdAt__lte} : {}),
    };
  }

  if (
    input?.updatedAt__gt != null ||
    input?.updatedAt__gte != null ||
    input?.updatedAt__lt != null ||
    input?.updatedAt__lte != null
  ) {
    where.updatedAt = {
      ...(input.updatedAt__gt != null ? {gt: input.updatedAt__gt} : {}),
      ...(input.updatedAt__gte != null ? {gte: input.updatedAt__gte} : {}),
      ...(input.updatedAt__lt != null ? {lt: input.updatedAt__lt} : {}),
      ...(input.updatedAt__lte != null ? {lte: input.updatedAt__lte} : {}),
    };
  }

  const [count, data] = await prisma.$transaction([
    prisma.user.count({where}),
    prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        bio: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    data,
    count,
    hasNext: false,
    hasPrevious: false,
  };
}

export async function getUser(id: number): Promise<User | null> {
  return await prisma.user.findUnique({
    where: {id},
    select: {
      id: true,
      bio: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUser(data: CreateUserInput): Promise<User> {
  data.password = await hash(data.password, 8);

  return await prisma.user.create({
    data,
    select: {
      id: true,
      bio: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateUser(id: number, data: UpdateUserInput): Promise<User> {
  data.password = data.password ? await hash(data.password, 8) : undefined;

  return await prisma.user.update({
    where: {id},
    data,
    select: {
      id: true,
      bio: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: number): Promise<void> {
  await prisma.user.delete({
    where: {id},
    select: {id: true},
  });
}
