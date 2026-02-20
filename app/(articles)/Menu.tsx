'use client';

import {ark} from '@ark-ui/react';
import {HashIcon} from 'lucide-react';
import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {useMeQuery} from '~/hooks/useMeQuery';
import {dataAttr} from '~/utils/dataAttr';

export function Menu() {
  const query = useMeQuery();
  const params = useParams<{tag?: string}>();
  const pathname = usePathname();

  const links: {
    icon?: ReactNode;
    path: string;
    label: string;
    hidden?: boolean;
    active?: boolean;
  }[] = [
    {
      path: '/',
      label: 'Global Feed',
      active: pathname === '/',
    },
    {
      path: '/your-feed',
      label: 'Your Feed',
      active: pathname === '/your-feed',
      hidden: query.data == null,
    },
    {
      path: '/login',
      label: 'Sign in to see Your Feed',
      hidden: query.data != null,
    },
    {
      icon: <HashIcon />,
      path: `/${params.tag}`,
      label: params.tag ?? '',
      active: pathname === `/${params.tag}`,
      hidden: !params.tag,
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
                className="-mb-px flex cursor-pointer items-center gap-0.5 border-b-2 border-transparent px-3 py-2 text-gray-500 transition-colors duration-200 hover:text-gray-600 ui-selected:border-b-emerald-400 ui-selected:text-emerald-500"
                data-selected={dataAttr(link.active)}
              >
                {!!link.icon && (
                  <ark.svg className="size-4" asChild>
                    {link.icon}
                  </ark.svg>
                )}

                <span>{link.label}</span>
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
