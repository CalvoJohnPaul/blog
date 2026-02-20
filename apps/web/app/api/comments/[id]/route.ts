import {type NextRequest, NextResponse} from 'next/server';
import {deleteComment} from '~/app/services/Comment';
import {IdDefinition, type VoidHttpResponse} from '~/definitions/common';

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/comments/[id]'>) {
  const params = await ctx.params;
  const commentId = IdDefinition.optional().nullable().catch(null).parse(params.id);

  if (commentId == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  await deleteComment(commentId);
  return NextResponse.json<VoidHttpResponse>({ok: true});
}
