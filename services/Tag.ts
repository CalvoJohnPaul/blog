import {cache} from 'react';
import {prisma} from '~/config/prisma';

export const findTags = cache(async (): Promise<string[]> => {
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
    LIMIT 25;
  `;

  return data.map((row) => row.tag);
});
