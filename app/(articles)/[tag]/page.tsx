import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';
import {IdDefinition} from '~/definitions/common';
import {PostsInputDefinition} from '~/definitions/post';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {findPosts} from '~/services/Post';
import {findUser} from '~/services/User';
import {getQueryClient} from '~/utils/getQueryClient';
import {Page__client} from './page.client';

interface Props {
  params: Promise<{
    tag: string;
  }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Page(props: Props) {
  const search = await props.searchParams;
  const params = await props.params;

  const input = PostsInputDefinition.parse({
    page: search.page,
    pageSize: search.pageSize,
  });

  const client = getQueryClient();
  const store = await cookies();
  const userId = IdDefinition.optional().nullable().catch(null).parse(store.get('user')?.value);
  const user = userId == null ? null : await findUser(userId);

  if (user == null) return notFound();

  await client
    .prefetchQuery({
      queryKey: usePostsQuery.getQueryKey({
        ...input,
        tag__has: params.tag,
      }),
      queryFn: () =>
        findPosts({
          ...input,
          tag__has: params.tag,
        }),
    })
    .catch(() => undefined);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Page__client />
    </HydrationBoundary>
  );
}
