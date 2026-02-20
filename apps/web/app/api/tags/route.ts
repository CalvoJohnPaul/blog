import {NextResponse} from 'next/server';
import {findTags} from '~/app/services/Tag';
import type {HttpResponse} from '~/definitions/common';

export async function GET() {
  const data = await findTags();
  return NextResponse.json<HttpResponse<string[]>>({ok: true, data});
}
