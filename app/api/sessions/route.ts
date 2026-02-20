import {NextResponse, type NextRequest} from 'next/server';
import type {VoidHttpResponse} from '~/definitions/common';
import {CreateSessionInputDefinition} from '~/definitions/session';
import {createSession, destroySession} from '~/services/Session';

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

  const ok = await createSession(parsed.data);

  if (!ok) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Invalid credentials',
      },
    });
  }

  return NextResponse.json<VoidHttpResponse>({ok: true});
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json<VoidHttpResponse>({ok: true});
}
