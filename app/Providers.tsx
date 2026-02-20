import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import type {PropsWithChildren} from 'react';
import type {User} from '~/definitions/user';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';
import {Providers__client} from './Providers.client';
import {getCurrentUser} from './services/Session';

export async function Providers({children}: PropsWithChildren) {
  const client = getQueryClient();
  await client.prefetchQuery<User | null>({
    queryKey: useMeQuery.getQueryKey(),
    queryFn: () => getCurrentUser(),
  });

  return (
    <Providers__client>
      <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
    </Providers__client>
  );
}
