import {NextResponse, type NextRequest} from 'next/server';
import {IdDefinition, type HttpResponse, type Paginated} from '~/definitions/common';
import {CreatePostInputDefinition, PostsInputDefinition, type Post} from '~/definitions/post';
import {createPost, findPosts} from '~/services/Post';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const parsed = PostsInputDefinition.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Paginated<Post>>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const data = await findPosts(parsed.data);

  return NextResponse.json<HttpResponse<Paginated<Post>>>({ok: true, data});
}

export async function POST(req: NextRequest) {
  const userId = IdDefinition.nullable()
    .optional()
    .catch(null)
    .parse(req.cookies.get('user')?.value);

  if (userId == null) {
    return NextResponse.json<HttpResponse<Post>>({
      ok: false,
      error: {
        name: 'UnauthorizedError',
        message: 'You must be logged in to create a post',
      },
    });
  }

  const input = await req.json();
  const parsed = CreatePostInputDefinition.omit({userId: true}).safeParse(input);

  if (!parsed.success) {
    return NextResponse.json<HttpResponse<Post>>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  const data = await createPost({...parsed.data, userId});

  return NextResponse.json<HttpResponse<Post>>({ok: true, data});
}
