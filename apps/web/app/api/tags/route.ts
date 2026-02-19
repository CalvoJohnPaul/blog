import {NextResponse} from 'next/server';
import {prisma} from '~/config/prisma';
import type {HttpResponse} from '~/definitions/common';

export const GET = async () => {
  const data = await prisma.$queryRaw<{tag: string}[]>`
    SELECT tag
    FROM (
      SELECT tag, COUNT(*) AS cnt
      FROM (
        SELECT UNNEST(tags) AS tag
        FROM "Post"
      ) t
      GROUP BY tag
    ) ranked
    ORDER BY cnt DESC
    LIMIT 10;
  `;

  return NextResponse.json<HttpResponse<string[]>>({
    ok: true,
    data: data.map((row) => row.tag),
  });
};
