import {NextResponse, type NextRequest} from 'next/server';
import {createComment, findComments} from '~/app/services/Comment';
import {
  CommentsInputDefinition,
  CreateCommentInputDefinition,
  type Comment,
} from '~/definitions/comment';
import {IdDefinition, type HttpResponse, type Paginated} from '~/definitions/common';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsed = CommentsInputDefinition.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Paginated<Comment>>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const data = await findComments(parsed.data);

  return NextResponse.json<HttpResponse<Paginated<Comment>>>({ok: true, data});
}

export async function POST(req: NextRequest) {
  const userId = IdDefinition.nullable()
    .optional()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  if (userId == null) {
    return NextResponse.json<HttpResponse<Comment>>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      },
    });
  }

  const input = await req.json();
  const parsed = CreateCommentInputDefinition.omit({userId: true}).safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Comment>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const data = await createComment({...parsed.data, userId});

  return NextResponse.json<HttpResponse<Comment>>({ok: true, data});
}
