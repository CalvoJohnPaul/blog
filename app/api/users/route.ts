import {addDays} from 'date-fns';
import {NextResponse, type NextRequest} from 'next/server';
import {prisma} from '~/config/prisma';
import type {HttpResponse} from '~/definitions/common';
import {CreateUserInputDefinition, type User} from '~/definitions/user';
import {createUser} from '~/services/User';

export async function POST(req: NextRequest) {
  const input = await req.json();
  const parsed = CreateUserInputDefinition.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const exists = await prisma.user.count({where: {email: parsed.data.email}}).then((n) => n > 0);

  if (exists) {
    return NextResponse.json<HttpResponse<User>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Email is already taken',
      },
    });
  }

  const data = await createUser(parsed.data);
  const res = NextResponse.json<HttpResponse<User>>({ok: true, data});

  res.cookies.set('user', data.id.toString(), {
    httpOnly: true,
    sameSite: 'strict',
    expires: addDays(new Date(), 7),
  });

  return res;
}
