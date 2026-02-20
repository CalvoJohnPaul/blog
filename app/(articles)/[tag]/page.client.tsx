'use client';

import clsx from 'clsx';
import {format} from 'date-fns';
import {HeartIcon} from 'lucide-react';
import Link from 'next/link';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {Avatar} from '~/components/ui/Avatar';
import {Pagination} from '~/components/ui/Pagination';
import type {Paginated} from '~/definitions/common';
import {type Post, PostsInputDefinition} from '~/definitions/post';
import {useAddPostToFavouritesMutation} from '~/hooks/useAddPostToFavouritesMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {useRemovePostFromFavouritesMutation} from '~/hooks/useRemovePostFromFavouritesMutation';
import {getQueryClient} from '~/utils/getQueryClient';

export function Page__client() {
  const client = getQueryClient();
  const router = useRouter();
  const params = useParams<{tag: string}>();
  const searchParams = useSearchParams();
  const meQuery = useMeQuery();

  const {page, pageSize} = PostsInputDefinition.parse({
    page: searchParams.get('page'),
    pageSize: searchParams.get('pageSize'),
  });

  const postsQuery = usePostsQuery(
    {
      page,
      pageSize,
      tag__has: params.tag,
    },
    {
      enabled: meQuery.data != null,
    },
  );

  const addToFavouritesMutation = useAddPostToFavouritesMutation();
  const removeFromFavouritesMutation = useRemovePostFromFavouritesMutation();

  return (
    <div className="space-y-4 py-4">
      {postsQuery.data?.rows.map((post) => (
        <div key={post.id} className="border-b border-b-gray-200 py-4 last:border-b-0">
          <div className="flex items-start">
            <div className="flex items-center gap-2">
              <Avatar.Root>
                {post.user.image && <Avatar.Image src={post.user.image} />}
                <Avatar.Fallback />
              </Avatar.Root>
              <div>
                <Link
                  href={`/profile/${post.user.id}`}
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
            <button
              type="submit"
              className="flex items-center gap-1 rounded border border-emerald-400 px-1.5 py-1 text-emerald-500 transition-colors ui-selected:bg-emerald-400 duration-200 hover:bg-emerald-50/50 disabled:cursor-not-allowed"
              onClick={async () => {
                if (meQuery.data != null && post.favouritedBy.includes(meQuery.data?.id)) {
                  await removeFromFavouritesMutation.mutateAsync(post.id);

                  client.setQueriesData<Paginated<Post>>(
                    {
                      queryKey: usePostsQuery.getQueryKey(),
                      exact: false,
                      type: 'all',
                    },
                    (prev) => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        rows: prev.rows.map((item) => {
                          if (item.id !== post.id) return item;
                          return {
                            ...item,
                            favouritedBy: item.favouritedBy.filter((id) => id !== meQuery.data?.id),
                            favouritesCount: item.favouritesCount - 1,
                          };
                        }),
                      };
                    },
                  );
                } else {
                  await addToFavouritesMutation.mutateAsync(post.id);

                  client.setQueriesData<Paginated<Post>>(
                    {
                      queryKey: usePostsQuery.getQueryKey(),
                      exact: false,
                      type: 'all',
                    },
                    (prev) => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        rows: prev.rows.map((item) => {
                          if (item.id !== post.id) return item;
                          return {
                            ...item,
                            favouritedBy: [...item.favouritedBy, meQuery.data?.id ?? 0],
                            favouritesCount: item.favouritesCount + 1,
                          };
                        }),
                      };
                    },
                  );
                }
              }}
              disabled={
                meQuery.data == null ||
                addToFavouritesMutation.isPending ||
                removeFromFavouritesMutation.isPending
              }
            >
              <HeartIcon
                className={clsx(
                  'size-3',
                  meQuery.data != null && post.favouritedBy.includes(meQuery.data?.id)
                    ? 'stroke-emerald-400 fill-emerald-400'
                    : 'stroke-emerald-400',
                )}
              />
              <span className="text-sm leading-none">{post.favouritesCount}</span>
            </button>
          </div>

          <h2 className="mt-4 text-2xl leading-tight font-semibold">{post.title}</h2>
          <p className="mt-1 text-gray-500">{post.description}</p>

          <div className="mt-3 lg:mt-4 flex flex-col lg:flex-row lg:items-center">
            <Link
              href={`/article/${post.slug}`}
              className="order-2 mt-4 text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-500 lg:order-0 lg:mt-0"
            >
              Read more...
            </Link>
            <div className="hidden lg:block grow"></div>
            <nav className="order-1 flex flex-wrap gap-1 lg:order-0">
              <ul className="contents">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/${tag}`}
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
          router.push(`/${params.toString()}`);
        }}
        count={postsQuery.data?.count ?? 0}
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
