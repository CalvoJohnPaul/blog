import {type NextRequest, NextResponse} from 'next/server';
import {type HttpResponse, IdDefinition} from '~/definitions/common';
import type {User} from '~/definitions/user';
import {findUser} from '~/services/User';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
  const params = await ctx.params;
  const userId = IdDefinition.optional().nullable().catch(null).parse(params.id);

  if (userId == null) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'NotFoundError',
        message: 'User not found',
      },
    });
  }

  const data = await findUser(userId);

  if (data == null) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'NotFoundError',
        message: 'User not found',
      },
    });
  }

  return NextResponse.json<HttpResponse<User>>({
    ok: true,
    data,
  });
}
