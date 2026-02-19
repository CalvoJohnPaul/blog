import {NextResponse, type NextRequest} from 'next/server';
import {prisma} from '~/config/prisma';
import {IdDefinition, type VoidHttpResponse} from '~/definitions/common';

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/users/[id]/follows'>) {
  const followerId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  const followingId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(await ctx.params.then((p) => p.id));

  if (followerId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      },
    });
  }

  if (followingId == null || followerId === followingId) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
    create: {
      followerId,
      followingId,
    },
    update: {
      followerId,
      followingId,
    },
  });

  return NextResponse.json<VoidHttpResponse>({ok: true});
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/users/[id]/follows'>) {
  const followerId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  const followingId = IdDefinition.optional()
    .nullable()
    .catch(null)
    .parse(await ctx.params.then((p) => p.id));

  if (followerId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      },
    });
  }

  if (followingId == null || followerId === followingId) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  await prisma.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });

  return NextResponse.json<VoidHttpResponse>({ok: true});
}
