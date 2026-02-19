import {clamp} from 'es-toolkit';
import {NextResponse, type NextRequest} from 'next/server';
import type {Prisma} from '~/.generated/prisma/client';
import {prisma} from '~/config/prisma';
import {
  CommentsInputDefinition,
  CreateCommentInputDefinition,
  type Comment,
} from '~/definitions/comment';
import {IdDefinition, type HttpResponse, type Paginated} from '~/definitions/common';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsed = CommentsInputDefinition.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Paginated<Comment>>>({
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

  const hasNext = skip + take < count;
  const hasPrevious = page > 1;

  return NextResponse.json<HttpResponse<Paginated<Comment>>>({
    ok: true,
    data: {
      rows: data,
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
    return NextResponse.json<HttpResponse<Comment>>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'You must be logged in to create a post',
      },
    });
  }

  const input = await req.json();
  const parsed = CreateCommentInputDefinition.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Comment>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const data = await prisma.comment.create({
    data: {
      ...parsed.data,
      userId,
    },
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

  return NextResponse.json<HttpResponse<Comment>>({
    ok: true,
    data,
  });
}
