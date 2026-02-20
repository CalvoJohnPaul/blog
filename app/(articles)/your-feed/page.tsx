import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {redirect} from 'next/navigation';
import {PostsInputDefinition} from '~/definitions/post';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {findPosts} from '~/services/Post';
import {getCurrentUser} from '~/services/Session';
import {getQueryClient} from '~/utils/getQueryClient';
import {Page__client} from './page.client';

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Page(props: Props) {
  const user = await getCurrentUser();

  if (user == null) return redirect('/login');

  const search = await props.searchParams;
  const input = PostsInputDefinition.parse({
    page: search.page,
    pageSize: search.pageSize,
  });

  const client = getQueryClient();
  await client
    .prefetchQuery({
      queryKey: usePostsQuery.getQueryKey({
        ...input,
        favourites__has: user.id,
      }),
      queryFn: () =>
        findPosts({
          ...input,
          favourites__has: user.id,
        }),
    })
    .catch(() => undefined);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Page__client />
    </HydrationBoundary>
  );
}
