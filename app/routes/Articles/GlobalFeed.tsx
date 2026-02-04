import clsx from 'clsx';
import {format} from 'date-fns';
import {HeartIcon} from 'lucide-react';
import {Form, Link, useNavigate} from 'react-router';
import * as z from 'zod';
import {Avatar} from '~/components/ui/Avatar';
import {Pagination} from '~/components/ui/Pagination';
import {prisma} from '~/config/prisma';
import {getSession} from '~/utils/session';
import type {Route} from './+types/GlobalFeed';

const QueryInputDefinition = z.object({
  page: z
    .string()
    .nullable()
    .transform((v) => {
      if (!v) return 1;
      const n = parseInt(v);
      return Number.isNaN(n) ? 1 : n < 1 ? 1 : n;
    }),
  pageSize: z
    .string()
    .nullable()
    .transform((v) => {
      if (!v) return 5;
      const n = parseInt(v);
      return Number.isNaN(n) ? 5 : n < 1 ? 5 : n;
    }),
});

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const userQuery =
    session.data.user == null
      ? null
      : prisma.user.findUnique({
          where: {id: session.data.user},
          select: {
            id: true,
            name: true,
          },
        });

  const url = new URL(request.url);
  const {page, pageSize} = QueryInputDefinition.parse({
    page: url.searchParams.get('page'),
    pageSize: url.searchParams.get('pageSize'),
  });

  const postsCountQuery = prisma.post.count();
  const postsQuery = prisma.post.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      tags: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          favourites: true,
        },
      },
      favourites: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  const [total, posts, user] = userQuery
    ? await prisma.$transaction([postsCountQuery, postsQuery, userQuery])
    : [...(await prisma.$transaction([postsCountQuery, postsQuery])), null];

  return {
    posts,
    page,
    pageSize,
    total,
    user,
  };
}

export default function Page({loaderData}: Route.ComponentProps) {
  const {user, posts, total, page, pageSize} = loaderData;
  const navigate = useNavigate();

  return (
    <div className="space-y-4 py-4">
      {posts.map((post) => (
        <div key={post.id} className="border-b border-b-gray-200 py-4 last:border-b-0">
          <div className="flex items-start">
            <div className="flex items-center gap-2">
              <Avatar.Root>
                <Avatar.Image src={post.user.image ?? undefined} />
                <Avatar.Fallback />
              </Avatar.Root>
              <div>
                <Link
                  to={`/profile/${post.user.id}`}
                  className="block leading-tight text-emerald-500"
                >
                  {post.user.name}
                </Link>
                <div className="text-sm leading-tight text-gray-400">
                  {format(post.createdAt, 'MMM dd, yyyy hh:mm a')}
                </div>
              </div>
            </div>
            <div className="grow" />
            <Form method="POST" action="/favourites" navigate={false}>
              <input type="hidden" name="id" value={post.id} />
              <button
                type="submit"
                className="flex items-center gap-1 rounded border border-emerald-400 px-1.5 py-1 text-emerald-500 transition-colors ui-selected:bg-emerald-400 duration-200 hover:bg-emerald-50/50 disabled:cursor-not-allowed"
                disabled={user == null}
              >
                <HeartIcon
                  className={clsx(
                    'size-3',
                    user != null &&
                      post.favourites.some((favourite) => favourite.userId === user.id)
                      ? 'stroke-emerald-400 fill-emerald-400'
                      : 'stroke-emerald-400',
                  )}
                />
                <span className="text-sm leading-none">{post._count.favourites}</span>
              </button>
            </Form>
          </div>

          <h2 className="mt-4 text-2xl leading-tight font-semibold">{post.title}</h2>
          <p className="mt-1 text-gray-500">{post.description}</p>

          <div className="mt-3 lg:mt-4 flex flex-col lg:flex-row lg:items-center">
            <Link
              to={`/article/${post.slug}`}
              className="order-2 mt-4 text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-500 lg:order-none lg:mt-0"
            >
              Read more...
            </Link>
            <div className="hidden lg:block grow"></div>
            <nav className="order-1 flex flex-wrap gap-1 lg:order-none">
              <ul className="contents">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      to={`/${tag}`}
                      className="flex items-center rounded-full px-2 py-1 leading-none border-gray-200 border text-emerald-500 text-xs"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ))}

      <Pagination.Root
        page={page}
        pageSize={pageSize}
        onPageChange={(details) => {
          const params = new URLSearchParams();
          params.set('page', details.page.toString());
          params.set('pageSize', details.pageSize.toString());

          navigate({
            search: params.toString(),
          });
        }}
        count={total}
        className="mx-auto mt-12 lg:mt-16 w-fit"
      >
        <Pagination.FirstTrigger className="lg:hidden" />
        <Pagination.PrevTrigger />
        <div className="hidden lg:contents">
          <Pagination.Context>
            {(api) => (
              <>
                {api.pages.map((page, index) => {
                  if (page.type === 'ellipsis') return <Pagination.Ellipsis index={index} />;
                  return (
                    <Pagination.Item key={index} {...page}>
                      {page.value}
                    </Pagination.Item>
                  );
                })}
              </>
            )}
          </Pagination.Context>
        </div>
        <Pagination.NextTrigger />
        <Pagination.LastTrigger className="lg:hidden" />
      </Pagination.Root>
    </div>
  );
}
