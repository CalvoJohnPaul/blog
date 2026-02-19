import {NextResponse, type NextRequest} from 'next/server';
import {prisma} from '~/config/prisma';
import {IdDefinition, type VoidHttpResponse} from '~/definitions/common';

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/posts/[id]/favourites'>) {
  const postId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(await ctx.params.then((p) => p.id));

  const userId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  if (userId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      },
    });
  }

  if (postId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const count = await prisma.favourite.count({
    where: {
      postId,
      userId,
    },
  });

  if (count <= 0) {
    await prisma.favourite.create({
      data: {
        userId,
        postId,
      },
    });
  }

  return NextResponse.json<VoidHttpResponse>({ok: true});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/posts/[id]/favourites'>) {
  const postId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(await ctx.params.then((p) => p.id));

  const userId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  if (userId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      },
    });
  }

  if (postId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  await prisma.favourite.deleteMany({
    where: {
      postId,
      userId,
    },
  });

  return NextResponse.json<VoidHttpResponse>({ok: true});
}
