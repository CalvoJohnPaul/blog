'use client';

import {ark} from '@ark-ui/react';
import {EditIcon, SettingsIcon} from 'lucide-react';
import Link from 'next/link';
import {useParams, usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {useMeQuery} from '~/hooks/useMeQuery';
import {dataAttr} from '~/utils/dataAttr';

export function Navbar() {
  const query = useMeQuery();
  const params = useParams<{tag: string}>();
  const pathname = usePathname();

  const links: {
    icon?: ReactNode;
    path: string;
    label: string;
    active?: boolean;
    hidden?: boolean;
  }[] = [
    {
      path: '/',
      label: 'Home',
      active:
        pathname === '/' ||
        pathname === '/your-feed' ||
        (params.tag != null && pathname === `/${params.tag}`),
    },
    {
      path: '/login',
      label: 'Sign In',
      active: pathname === '/login',
      hidden: query.data != null,
    },
    {
      path: '/register',
      label: 'Sign Up',
      active: pathname === '/register',
      hidden: query.data != null,
    },
    {
      icon: <EditIcon />,
      path: '/editor',
      label: 'New Post',
      active: pathname === '/editor',
      hidden: query.data == null,
    },
    {
      icon: <SettingsIcon />,
      path: '/settings',
      label: 'Settings',
      active: pathname === '/settings',
      hidden: query.data == null,
    },
    {
      path: `/profile/${query.data?.id}`,
      active: pathname.startsWith(`/profile/${query.data?.id}`),
      label: query.data?.name ?? '',
      hidden: query.data == null,
    },
  ];

  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between gap-5 px-4 py-3">
      <Link href="/">
        <h2 className="font-heading text-2xl font-bold text-emerald-500 lowercase">Conduit</h2>
      </Link>
      <nav className="flex items-center gap-3">
        <ul className="contents">
          {links
            .filter((link) => !link.hidden)
            .map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="flex items-center gap-1 text-gray-500 transition-colors duration-200 hover:text-gray-600 ui-selected:text-gray-700"
                  data-selected={dataAttr(link.active)}
                >
                  {!!link.icon && (
                    <ark.svg className="size-5" asChild>
                      {link.icon}
                    </ark.svg>
                  )}
                  <span className={link.icon ? 'hidden lg:block' : ''}>{link.label}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  );
}
