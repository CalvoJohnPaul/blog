import {clamp} from 'es-toolkit';
import {cache} from 'react';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import type {Comment, CommentsInput, CreateCommentInput} from '~/definitions/comment';
import type {Paginated} from '~/definitions/common';

export const findComments = cache(async (input?: CommentsInput): Promise<Paginated<Comment>> => {
  const page = clamp(input?.page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const take = clamp(input?.pageSize ?? 10, 10, 100);
  const skip = (page - 1) * take;
  const where: Prisma.CommentWhereInput = {};

  if (
    input?.postId__eq != null ||
    input?.postId__neq != null ||
    input?.postId__in != null ||
    input?.postId__nin != null
  ) {
    where.postId = {
      ...(input.postId__eq != null ? {equals: input.postId__eq} : {}),
      ...(input.postId__neq != null ? {not: input.postId__neq} : {}),
      ...(input.postId__in != null ? {in: input.postId__in} : {}),
      ...(input.postId__nin != null ? {notIn: input.postId__nin} : {}),
    };
  }

  if (
    input?.userId__eq != null ||
    input?.userId__neq != null ||
    input?.userId__in != null ||
    input?.userId__nin != null
  ) {
    where.userId = {
      ...(input.userId__eq != null ? {equals: input.userId__eq} : {}),
      ...(input.userId__neq != null ? {not: input.userId__neq} : {}),
      ...(input.userId__in != null ? {in: input.userId__in} : {}),
      ...(input.userId__nin != null ? {notIn: input.userId__nin} : {}),
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

  const [count, rows] = await prisma.$transaction([
    prisma.comment.count({where}),
    prisma.comment.findMany({
      skip,
      take,
      select: {
        id: true,
        postId: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  const hasNext = skip + take < count;
  const hasPrevious = page > 1;

  return {
    rows,
    count,
    hasNext,
    hasPrevious,
  };
});

export async function createComment(data: CreateCommentInput): Promise<Comment> {
  return await prisma.comment.create({
    data,
    select: {
      id: true,
      postId: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteComment(id: number): Promise<void> {
  await prisma.comment.delete({where: {id}});
}
