import {NextResponse, type NextRequest} from 'next/server';
import {prisma} from '~/config/prisma';
import {IdDefinition, type HttpResponse} from '~/definitions/common';
import type {Post} from '~/definitions/post';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const params = await ctx.params;

  const [slug, id] = !/^\d+$/.test(params.id)
    ? [params.id, undefined]
    : [undefined, IdDefinition.optional().nullable().catch(null).parse(params.id) ?? undefined];

  if (id == null && slug == null) {
    return NextResponse.json<HttpResponse<Post>>({
      ok: false,
      error: {
        name: 'NotFoundError',
        message: 'Post not found',
      },
    });
  }

  const userId = IdDefinition.nullable()
    .optional()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  const data = await prisma.post
    .findUnique({
      where: {
        id,
        slug,
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
    .then((v) =>
      v == null
        ? null
        : {
            ...v,
            favourite: userId == null ? false : v.favourites.some((f) => f.userId === userId),
            commentsCount: v._count.comments,
            favouritesCount: v._count.favourites,
          },
    );

  if (data == null) {
    return NextResponse.json<HttpResponse<Post>>({
      ok: false,
      error: {
        name: 'NotFoundError',
        message: 'Post not found',
      },
    });
  }

  return NextResponse.json<HttpResponse<Post>>({ok: true, data});
}
