import {ark} from '@ark-ui/react';
import {HashIcon} from 'lucide-react';
import type {ReactNode} from 'react';
import {Link, Outlet, useLocation} from 'react-router';
import {prisma} from '~/config/prisma';
import {dataAttr} from '~/utils/dataAttr';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Layout';

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const tagsQuery = prisma.$queryRaw<
    {
      tag: string;
      count: number;
    }[]
  >`
    SELECT tag, COUNT(*)::int AS count
    FROM (
      SELECT UNNEST(tags) AS tag
      FROM "Post"
    ) t
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 10;
  `;

  const [tags, user] = session.data.user
    ? await prisma.$transaction([
        tagsQuery,
        prisma.user.findUnique({
          where: {id: session.data.user},
          select: {
            id: true,
            name: true,
          },
        }),
      ])
    : [await tagsQuery, null];

  return {user, tags};
}

export default function Layout({params, loaderData}: Route.ComponentProps) {
  const location = useLocation();

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
      active: location.pathname === '/',
    },
    {
      path: '/your-feed',
      label: 'Your Feed',
      active: location.pathname === '/your-feed',
      hidden: loaderData.user == null,
    },
    {
      path: '/login',
      label: 'Sign in to see Your Feed',
      hidden: loaderData.user != null,
    },
    {
      icon: <HashIcon />,
      path: `/${params.tag}`,
      label: params.tag ?? '',
      active: location.pathname === `/${params.tag}`,
      hidden: !params.tag,
    },
  ];

  return (
    <div>
      {loaderData.user == null && (
        <div className="flex flex-col items-center bg-emerald-500 px-4 py-10 text-white">
          <h1 className="font-heading text-5xl leading-none drop-shadow-md">conduit</h1>
          <p className="mt-3 text-2xl leading-none font-light">A place to share your knowledge</p>
        </div>
      )}

      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-4 py-6 lg:flex-row">
        <section className="order-1 grow lg:order-0">
          <nav>
            <ul className="relative flex border-b border-gray-200">
              {links
                .filter((link) => !link.hidden)
                .map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="-mb-px flex cursor-pointer items-center gap-0.5 border-b-2 border-transparent px-3 py-2 text-gray-500 transition-colors duration-200 hover:text-gray-600 data-selected:border-b-emerald-400 data-selected:text-emerald-500"
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

          <Outlet />
        </section>

        <section className="order-0 w-full shrink-0 rounded bg-gray-100 p-4 lg:order-1 lg:w-64">
          <h2 className="tracking-wide">Popular Tags</h2>

          <ul className="mt-2.5 flex flex-wrap gap-1">
            {loaderData.tags.map(({tag}) => (
              <li key={tag}>
                <Link
                  to={`/${tag}`}
                  className="flex items-center rounded-full bg-gray-500 px-2 py-1 text-sm leading-none text-white transition-colors duration-200 hover:bg-gray-600"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
