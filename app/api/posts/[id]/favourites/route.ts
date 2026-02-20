import {NextResponse, type NextRequest} from 'next/server';
import {markPostAsFavourite, unmarkPostAsFavourite} from '~/app/services/Post';
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

  await markPostAsFavourite({postId, userId});

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

  await unmarkPostAsFavourite({postId, userId});

  return NextResponse.json<VoidHttpResponse>({ok: true});
}
