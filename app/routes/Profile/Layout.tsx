import {RssIcon, SettingsIcon} from 'lucide-react';
import {Form, Link, Outlet, useLocation} from 'react-router';
import * as z from 'zod';
import {Avatar} from '~/components/ui/Avatar';
import {prisma} from '~/config/prisma';
import {dataAttr} from '~/utils/dataAttr';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Layout';

export async function loader({request, params}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const id = z
    .string()
    .transform((v) => {
      const n = parseInt(v);
      return Number.isNaN(n) ? null : n;
    })
    .parse(params.id);

  if (id == null) throw new Response('Not Found', {status: 404});

  const profileQuery = prisma.user.findUnique({
    where: {id},
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      followers: {
        select: {
          followerId: true,
        },
      },
    },
  });

  const [user, profile] = session.data.user
    ? await prisma.$transaction([
        prisma.user.findUnique({
          where: {id: session.data.user},
          select: {
            id: true,
            name: true,
            followers: {
              select: {
                followerId: true,
              },
            },
          },
        }),
        profileQuery,
      ])
    : [null, await profileQuery];

  if (profile == null) throw new Response('Not Found', {status: 404});

  return {user, profile};
}

export default function Layout({loaderData}: Route.ComponentProps) {
  const location = useLocation();
  const {user, profile} = loaderData;
  const following = user?.followers.some((f) => f.followerId === user.id) ?? false;
  const ownProfile = user?.id === profile.id;

  const links: {
    path: string;
    label: string;
    active: boolean;
  }[] = [
    {
      path: `/profile/${profile.id}`,
      label: 'Articles',
      active: location.pathname === `/profile/${profile.id}`,
    },
    {
      path: `/profile/${profile.id}/favourites`,
      label: 'Favourites',
      active: location.pathname === `/profile/${profile.id}/favourites`,
    },
  ];

  return (
    <div>
      <section className="bg-gray-50 px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-10">
          <Avatar.Root className="bg-emerald-100 size-24">
            <Avatar.Image src={profile.image ?? ''} />
            <Avatar.Fallback className="icon:size-14 icon:text-emerald-500" />
          </Avatar.Root>

          <h2 className="mt-5 text-2xl leading-tight font-bold text-gray-600">{profile.name}</h2>
          <p className="text-gray-500 leading-tight mb-2">{profile.email}</p>

          {ownProfile ? (
            <Link
              to="/settings"
              className="flex mt-5 items-center gap-1 rounded border border-gray-200 px-3 py-2 bg-white text-gray-600"
            >
              <SettingsIcon className="size-4" />
              <span className="text-sm">Edit Profile Settings</span>
            </Link>
          ) : (
            <Form method="POST" action="/following" navigate={false}>
              <input type="hidden" name="id" value={profile.id} />
              <button
                type="submit"
                className="flex mt-5 items-center gap-1 ui-selected:bg-emerald-400 ui-selected:border-emerald-400 ui-selected:text-white rounded border border-gray-200 px-3 py-2 bg-white text-gray-600"
                data-selected={dataAttr(following)}
              >
                <RssIcon className="size-4" />
                <span className="text-sm">{following ? 'Unfollow' : 'Follow'}</span>
              </button>
            </Form>
          )}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl px-4">
        <nav>
          <ul className="relative flex border-b border-gray-200">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="-mb-px flex cursor-pointer items-center gap-0.5 border-b-2 border-transparent px-3 py-2 text-gray-500 transition-colors duration-200 hover:text-gray-600 data-selected:border-b-emerald-400"
                  data-selected={dataAttr(link.active)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Outlet />
      </section>
    </div>
  );
}
