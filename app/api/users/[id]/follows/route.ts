import {NextResponse, type NextRequest} from 'next/server';
import {IdDefinition, type VoidHttpResponse} from '~/definitions/common';
import {follow, unfollow} from '~/services/Follow';

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

  await follow({
    followerId,
    followingId,
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

  await unfollow({
    followerId,
    followingId,
  });

  return NextResponse.json<VoidHttpResponse>({ok: true});
}
