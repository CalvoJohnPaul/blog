import {hash} from 'bcrypt';
import {NextResponse, type NextRequest} from 'next/server';
import {prisma} from '~/config/prisma';
import {IdDefinition, type HttpResponse} from '~/definitions/common';
import {UpdateUserDataInputDefinition, type User} from '~/definitions/user';

export async function GET(req: NextRequest) {
  const id = IdDefinition.optional().nullable().catch(null).parse(req.cookies.get('user')?.value);

  const data =
    id == null
      ? null
      : await prisma.user
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

  return NextResponse.json<HttpResponse<User | null>>({
    ok: true,
    data,
  });
}

export async function PATCH(req: NextRequest) {
  const id = IdDefinition.optional().nullable().catch(null).parse(req.cookies.get('user')?.value);

  if (id == null) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Not authenticated',
      },
    });
  }

  const input = await req.json();
  const parsed = UpdateUserDataInputDefinition.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  if (id == null) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Not authenticated',
      },
    });
  }

  const data = await prisma.user
    .update({
      where: {id},
      data: {
        ...parsed.data,
        password: parsed.data.password ? await hash(parsed.data.password, 8) : undefined,
      },
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
    .then((v) => ({
      ...v,
      followers: v.following.map((f) => f.followerId),
      following: v.followers.map((f) => f.followingId),
    }));

  return NextResponse.json<HttpResponse<User>>({
    ok: true,
    data,
  });
}
