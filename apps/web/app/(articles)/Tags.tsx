'use client';

import Link from 'next/link';
import {useTagsQuery} from '~/hooks/useTagsQuery';

export function Tags() {
  const query = useTagsQuery();

  return (
    <ul className="mt-2.5 flex flex-wrap gap-1">
      {query.data?.map((tag) => (
        <li key={tag}>
          <Link
            href={`/${tag}`}
            className="flex items-center rounded-full bg-gray-500 px-2 py-1 text-sm leading-none text-white transition-colors duration-200 hover:bg-gray-600"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
