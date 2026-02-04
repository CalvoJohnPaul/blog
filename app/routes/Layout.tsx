import {ark} from '@ark-ui/react';
import {EditIcon, SettingsIcon} from 'lucide-react';
import type {ReactNode} from 'react';
import {Link, Outlet, useLocation, useParams} from 'react-router';
import {prisma} from '~/config/prisma';
import {dataAttr} from '~/utils/dataAttr';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Layout';

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.data.user
    ? await prisma.user.findUnique({
        where: {id: session.data.user},
        select: {
          id: true,
          name: true,
        },
      })
    : null;

  return {user};
}

export default function Layout({loaderData}: Route.ComponentProps) {
  const {user} = loaderData;
  const location = useLocation();
  const params = useParams();

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
        location.pathname === '/' ||
        location.pathname === '/your-feed' ||
        (params.tag != null && location.pathname === `/${params.tag}`),
    },
    {
      path: '/login',
      label: 'Sign In',
      active: location.pathname === '/login',
      hidden: user != null,
    },
    {
      path: '/register',
      label: 'Sign Up',
      active: location.pathname === '/register',
      hidden: user != null,
    },
    {
      icon: <EditIcon />,
      path: '/editor',
      label: 'New Post',
      active: location.pathname === '/editor',
      hidden: user == null,
    },
    {
      icon: <SettingsIcon />,
      path: '/settings',
      label: 'Settings',
      active: location.pathname === '/settings',
      hidden: user == null,
    },
    {
      path: `/profile/${user?.id}`,
      active: location.pathname.startsWith(`/profile/${user?.id}`),
      label: user?.name ?? '',
      hidden: user == null,
    },
  ];

  return (
    <>
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-5 px-4 py-3">
        <Link to="/">
          <h2 className="font-heading text-2xl font-bold text-emerald-500 lowercase">Conduit</h2>
        </Link>
        <nav className="flex items-center gap-3">
          <ul className="contents">
            {links
              .filter((link) => !link.hidden)
              .map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-1 text-gray-500 transition-colors duration-200 hover:text-gray-600 data-selected:text-gray-700"
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
      <main>
        <Outlet />
      </main>
      <div className="h-16" />
    </>
  );
}
