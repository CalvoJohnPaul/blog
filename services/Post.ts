import {cache} from 'react';
import slugify from 'slugify';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import type {Paginated} from '~/definitions/common';
import type {CreatePostInput, Post, PostsInput} from '~/definitions/post';

export const findPosts = cache(async (input?: PostsInput): Promise<Paginated<Post>> => {
  const page = input?.page ?? 1;
  const take = input?.pageSize ?? 5;
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

  if (input?.tag__has != null) {
    where.tags = {
      ...(input?.tag__has != null ? {has: input.tag__has} : {}),
    };
  }

  if (input?.favourites__has != null) {
    where.favourites = {
      some: {userId: input.favourites__has},
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
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
            favourites: true,
          },
        },
        favourites: {
          select: {
            userId: true,
          },
        },
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
    rows: data.map((v) => ({
      ...v,
      content: '',
      commentsCount: v._count.comments,
      favouritedBy: v.favourites.map((f) => f.userId),
      favouritesCount: v._count.favourites,
    })),
    count,
    hasNext,
    hasPrevious,
  };
});

export const findPost = cache(async (id: number): Promise<Post | null> => {
  return await prisma.post
    .findUnique({
      where: {id},
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
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true,
            favourites: true,
          },
        },
        favourites: {
          select: {
            userId: true,
          },
        },
      },
    })
    .then((v) =>
      v == null
        ? null
        : {
            ...v,
            content: '',
            commentsCount: v._count.comments,
            favouritedBy: v.favourites.map((f) => f.userId),
            favouritesCount: v._count.favourites,
          },
    );
});

export const findPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return await prisma.post
    .findUnique({
      where: {slug},
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
        favourites: {
          select: {
            userId: true,
          },
        },
      },
    })
    .then((v) =>
      v == null
        ? null
        : {
            ...v,
            commentsCount: v._count.comments,
            favouritedBy: v.favourites.map((f) => f.userId),
            favouritesCount: v._count.favourites,
          },
    );
});

export async function createPost(input: CreatePostInput): Promise<Post> {
  return await prisma.post
    .create({
      data: {
        ...input,
        slug: slugify(input.title, {
          lower: true,
          trim: true,
          locale: 'en',
        }),
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
        favourites: {
          select: {
            userId: true,
          },
        },
      },
    })
    .then((v) => ({
      ...v,
      commentsCount: v._count.comments,
      favouritedBy: v.favourites.map((f) => f.userId),
      favouritesCount: v._count.favourites,
    }));
}

interface MarkPostAsFavouriteInput {
  postId: number;
  userId: number;
}

export async function markPostAsFavourite(input: MarkPostAsFavouriteInput): Promise<void> {
  const count = await prisma.favourite.count({where: input});
  if (count <= 0) await prisma.favourite.create({data: input});
}

interface UnmarkPostAsFavouriteInput {
  postId: number;
  userId: number;
}

export async function unmarkPostAsFavourite(input: UnmarkPostAsFavouriteInput): Promise<void> {
  await prisma.favourite.deleteMany({where: input});
}
