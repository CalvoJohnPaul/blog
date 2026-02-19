import {clamp, isString} from 'es-toolkit';
import slugify from 'slugify';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import type {Paginated} from '~/definitions/common';
import type {CreatePostInput, Post, PostsInput, UpdatePostInput} from '~/definitions/Post';

export async function getPosts(input?: PostsInput): Promise<Paginated<Post>> {
  const page = clamp(input?.page ?? 1, 1, Number.MAX_SAFE_INTEGER);
  const take = clamp(input?.pageSize ?? 10, 10, 100);
  const skip = (page - 1) * take;

  const where: Prisma.PostWhereInput = {};

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
    input?.slug__eq != null ||
    input?.slug__neq != null ||
    input?.slug__in != null ||
    input?.slug__nin != null ||
    input?.slug__contains != null
  ) {
    where.slug = {
      ...(input.slug__eq != null ? {equals: input.slug__eq} : {}),
      ...(input.slug__neq != null ? {not: input.slug__neq} : {}),
      ...(input.slug__in != null ? {in: input.slug__in} : {}),
      ...(input.slug__nin != null ? {notIn: input.slug__nin} : {}),
      ...(input.slug__contains != null
        ? {contains: input.slug__contains, mode: 'insensitive'}
        : {}),
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
    prisma.post.count({where}),
    prisma.post.findMany({
      skip,
      take,
      select: {
        id: true,
        slug: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        title: true,
        description: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
            favourites: true,
          },
        },
      },
      where,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    data: data.map((post) => ({
      ...post,
      commentsCount: post._count.comments,
      favouritesCount: post._count.favourites,
    })),
    count,
    hasNext: false,
    hasPrevious: false,
  };
}

export async function getPost(id: number): Promise<Post | null>;
export async function getPost(slug: string): Promise<Post | null>;
export async function getPost(arg: string | number): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: isString(arg) ? {slug: arg} : {id: arg},
    select: {
      id: true,
      slug: true,
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      title: true,
      description: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: true,
          favourites: true,
        },
      },
    },
  });

  if (!post) return null;

  return {
    ...post,
    commentsCount: post._count.comments,
    favouritesCount: post._count.favourites,
  };
}

export async function createPost(data: CreatePostInput): Promise<Post> {
  const slug = slugify(data.title, {
    lower: true,
    trim: true,
    locale: 'en',
  });

  const post = await prisma.post.create({
    data: {
      slug,
      ...data,
    },
    select: {
      id: true,
      slug: true,
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      title: true,
      description: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: true,
          favourites: true,
        },
      },
    },
  });

  return {
    ...post,
    commentsCount: post._count.comments,
    favouritesCount: post._count.favourites,
  };
}

export async function updatePost(id: number, data: UpdatePostInput): Promise<Post> {
  const post = await prisma.post.update({
    where: {id},
    data,
    select: {
      id: true,
      slug: true,
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      title: true,
      description: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          comments: true,
          favourites: true,
        },
      },
    },
  });

  return {
    ...post,
    commentsCount: post._count.comments,
    favouritesCount: post._count.favourites,
  };
}

export async function deletePost(id: number): Promise<void> {
  await prisma.post.delete({
    where: {id},
    select: {id: true},
  });
}
