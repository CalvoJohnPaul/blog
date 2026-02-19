import {type NextRequest, NextResponse} from 'next/server';
import {prisma} from '~/config/prisma';
import {IdDefinition, type VoidHttpResponse} from '~/definitions/common';

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/comments/[id]'>) {
  const params = await ctx.params;
  const id = IdDefinition.optional().nullable().catch(null).parse(params.id);

  if (id == null) {
    return NextResponse.json<VoidHttpResponse>({
      ok: false,
      error: {
        name: 'BadRequestError',
        message: 'Invalid input',
      },
    });
  }

  await prisma.comment.delete({where: {id}});

  return NextResponse.json<VoidHttpResponse>({ok: true});
}
