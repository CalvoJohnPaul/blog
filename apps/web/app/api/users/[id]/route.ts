import {type NextRequest, NextResponse} from 'next/server';
import {prisma} from '~/config/prisma';
import {type HttpResponse, IdDefinition} from '~/definitions/common';
import type {User} from '~/definitions/user';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {
  const params = await ctx.params;
  const id = IdDefinition.optional().nullable().catch(null).parse(params.id);

  if (id == null) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'NotFoundError',
        message: 'User not found',
      },
    });
  }

  const data = await prisma.user
    .findUnique({
      where: {id},
      select: {
        id: true,
        bio: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        followers: {select: {followingId: true}},
        following: {select: {followerId: true}},
      },
    })
    .then((v) =>
      v == null
        ? null
        : {
            ...v,
            followers: v.following.map((f) => f.followerId),
            following: v.followers.map((f) => f.followingId),
          },
    );

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
