import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {useTagsQuery} from '~/hooks/useTagsQuery';
import {getQueryClient} from '~/utils/getQueryClient';
import {findTags} from '../services/Tag';
import {Tags__client} from './Tags.client';

export async function Tags() {
  const client = getQueryClient();
  await client.prefetchQuery({
    queryKey: useTagsQuery.getQueryKey(),
    queryFn: () => findTags(),
  });

  return (
    <section className="order-0 w-full shrink-0 rounded bg-gray-100 p-4 lg:order-1 lg:w-64">
      <h2 className="tracking-wide">Popular Tags</h2>
      <HydrationBoundary state={dehydrate(client)}>
        <Tags__client />
      </HydrationBoundary>
    </section>
  );
}
