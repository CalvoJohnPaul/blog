import {NextResponse} from 'next/server';
import type {HttpResponse} from '~/definitions/common';
import {findTags} from '~/services/Tag';

export async function GET() {
  const data = await findTags();
  return NextResponse.json<HttpResponse<string[]>>({ok: true, data});
}
