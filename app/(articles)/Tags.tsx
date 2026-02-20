'use client';

import Link from 'next/link';
import {useTagsQuery} from '~/hooks/useTagsQuery';

export function Tags() {
  const query = useTagsQuery();
  const tags = query.data ?? [];

  return (
    <section className="order-0 w-full shrink-0 rounded bg-gray-100 p-4 lg:order-1 lg:w-64">
      <h2 className="tracking-wide">Popular Tags</h2>
      <ul className="mt-2.5 flex flex-wrap gap-1">
        {tags.map((tag) => (
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
    </section>
  );
}
