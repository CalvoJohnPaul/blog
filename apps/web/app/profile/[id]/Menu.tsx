'use client';

import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import {useUserQuery} from '~/hooks/useUserQuery';
import {dataAttr} from '~/utils/dataAttr';

export function Menu() {
  const pathname = usePathname();
  const params = useParams<{id: string}>();
  const userQuery = useUserQuery(params.id);

  const links: {
    path: string;
    label: string;
    active: boolean;
    hidden?: boolean;
  }[] = [
    {
      path: `/profile/${userQuery.data?.id}`,
      label: 'Articles',
      active: pathname === `/profile/${userQuery.data?.id}`,
    },
    {
      path: `/profile/${userQuery.data?.id}/favourites`,
      label: 'Favourites',
      active: pathname === `/profile/${userQuery.data?.id}/favourites`,
    },
  ];

  return (
    <nav>
      <ul className="relative flex border-b border-gray-200">
        {links
          .filter((link) => !link.hidden)
          .map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className="-mb-px flex cursor-pointer items-center gap-0.5 border-b-2 border-transparent px-3 py-2 text-gray-500 transition-colors duration-200 hover:text-gray-600 ui-selected:border-b-emerald-400"
                data-selected={dataAttr(link.active)}
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
