import {compare} from 'bcrypt';
import {addDays} from 'date-fns';
import {NextResponse, type NextRequest} from 'next/server';
import {prisma} from '~/config/prisma';
import type {VoidHttpResponse} from '~/definitions/common';
import {CreateSessionInputDefinition} from '~/definitions/session';

export async function POST(req: NextRequest) {
  const input = await req.json();
  const parsed = CreateSessionInputDefinition.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: {email: parsed.data.email},
    select: {
      id: true,
      password: true,
    },
  });

  if (user == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Invalid credentials',
      },
    });
  }

  const matches = await compare(parsed.data.password, user.password);

  if (!matches) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Invalid credentials',
      },
    });
  }

  const res = NextResponse.json<VoidHttpResponse>({ok: true});

  res.cookies.set('user', user.id.toString(), {
    httpOnly: true,
    sameSite: 'strict',
    expires: addDays(new Date(), 7),
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json<VoidHttpResponse>({ok: true});
  res.cookies.delete('user');
  return res;
}
