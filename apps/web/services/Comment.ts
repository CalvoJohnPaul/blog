import {clamp} from 'es-toolkit';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import type {
  Comment,
  CommentsInput,
  CreateCommentInput,
  UpdateCommentInput,
} from '~/definitions/Comment';
import type {Paginated} from '~/definitions/common';

export async function getComments(input?: CommentsInput): Promise<Paginated<Comment>> {
  const page = clamp(input?.page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const take = clamp(input?.pageSize ?? 10, 10, 100);
  const skip = (page - 1) * take;

  const where: Prisma.CommentWhereInput = {};

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

  const [count, data] = await prisma.$transaction([
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

  return {
    data,
    count,
    hasNext: false,
    hasPrevious: false,
  };
}

export async function getComment(id: number): Promise<Comment | null> {
  return await prisma.comment.findUnique({
    where: {id},
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

export async function updateComment(id: number, data: UpdateCommentInput): Promise<Comment> {
  return await prisma.comment.update({
    where: {id},
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
