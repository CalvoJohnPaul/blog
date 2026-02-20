import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {PostsInputDefinition} from '~/definitions/post';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {findPosts} from '~/services/Post';
import {getQueryClient} from '~/utils/getQueryClient';
import {Page__client} from './page.client';

interface Props {
  params: Promise<{
    id: string;
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
    userId__eq: Number(params.id),
  });

  const client = getQueryClient();
  await client
    .prefetchQuery({
      queryKey: usePostsQuery.getQueryKey(input),
      queryFn: () => findPosts(input),
    })
    .catch(() => undefined);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Page__client />
    </HydrationBoundary>
  );
}
