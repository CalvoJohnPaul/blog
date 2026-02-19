import {clamp} from 'es-toolkit';
import {NextResponse, type NextRequest} from 'next/server';
import slugify from 'slugify';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import {IdDefinition, type HttpResponse, type Paginated} from '~/definitions/common';
import {CreatePostInputDefinition, PostsInputDefinition, type Post} from '~/definitions/post';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsed = PostsInputDefinition.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Paginated<Post>>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const input = parsed.data;
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

  if (
    input.tag__eq != null ||
    input.tag__neq != null ||
    input.tag__in != null ||
    input.tag__nin != null
  ) {
    where.tags = {
      ...(input.tag__eq != null ? {has: input.tag__eq} : {}),
      ...(input.tag__neq != null ? {has: input.tag__neq, mode: 'insensitive', not: true} : {}),
      ...(input.tag__in != null ? {hasSome: input.tag__in} : {}),
      ...(input.tag__nin != null ? {hasNone: input.tag__nin} : {}),
    };
  }

  const userId = IdDefinition.nullable()
    .optional()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  if (userId != null) {
    if (input.favourited__eq != null || input.favourited__neq != null) {
      where.favourites = {
        ...(input.favourited__eq != null ? {some: {userId}} : {}),
        ...(input.favourited__neq != null ? {none: {userId}} : {}),
      };
    }
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

  return NextResponse.json<HttpResponse<Paginated<Post>>>({
    ok: true,
    data: {
      rows: data.map((v) => ({
        ...v,
        content: '',
        favourite: userId == null ? false : v.favourites.some((f) => f.userId === userId),
        commentsCount: v._count.comments,
        favouritesCount: v._count.favourites,
      })),
      count,
      hasNext,
      hasPrevious,
    },
  });
}

export async function POST(req: NextRequest) {
  const userId = IdDefinition.nullable()
    .optional()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  if (userId == null) {
    return NextResponse.json<HttpResponse<Post>>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'You must be logged in to create a post',
      },
    });
  }

  const input = await req.json();
  const parsed = CreatePostInputDefinition.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Post>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const data = await prisma.post
    .create({
      data: {
        ...parsed.data,
        userId,
        slug: slugify(parsed.data.title, {
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
      },
    })
    .then((v) => ({
      ...v,
      favourite: false,
      commentsCount: v._count.comments,
      favouritesCount: v._count.favourites,
    }));

  return NextResponse.json<HttpResponse<Post>>({ok: true, data});
}
