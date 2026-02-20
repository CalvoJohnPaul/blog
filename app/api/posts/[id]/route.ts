import {NextResponse, type NextRequest} from 'next/server';
import {IdDefinition, type HttpResponse} from '~/definitions/common';
import type {Post} from '~/definitions/post';
import {findPost, findPostBySlug} from '~/services/Post';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/posts/[id]'>) {
  const params = await ctx.params;

  const [slug, id] = /[a-z]+/.test(params.id)
    ? [params.id, undefined]
    : [undefined, IdDefinition.optional().nullable().catch(null).parse(params.id)];

  if (slug != null) {
    const data = await findPostBySlug(slug);
    if (data != null) return NextResponse.json<HttpResponse<Post>>({ok: true, data});
  }

  if (id != null) {
    const data = await findPost(id);
    if (data != null) return NextResponse.json<HttpResponse<Post>>({ok: true, data});
  }

  return NextResponse.json<HttpResponse<Post>>({
    ok: false,
    error: {
      name: 'NotFoundError',
      message: 'Post not found',
    },
  });
}
