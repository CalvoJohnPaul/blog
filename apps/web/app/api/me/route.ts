import {NextResponse, type NextRequest} from 'next/server';
import {getCurrentUser} from '~/app/services/Session';
import {updateUser} from '~/app/services/User';
import {IdDefinition, type HttpResponse} from '~/definitions/common';
import {UpdateUserDataInputDefinition, type User} from '~/definitions/user';

export async function GET() {
  const data = await getCurrentUser();
  return NextResponse.json<HttpResponse<User | null>>({ok: true, data});
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

  const data = await updateUser(id, parsed.data);

  return NextResponse.json<HttpResponse<User>>({ok: true, data});
}
