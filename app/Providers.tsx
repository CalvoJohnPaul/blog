import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import type {PropsWithChildren} from 'react';
import type {User} from '~/definitions/user';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';
import {getCurrentUser} from '../services/Session';
import {Providers__client} from './Providers.client';

export async function Providers({children}: PropsWithChildren) {
  const client = getQueryClient();
  await client
    .prefetchQuery<User | null>({
      queryKey: useMeQuery.getQueryKey(),
      queryFn: () => getCurrentUser(),
    })
    .catch(() => undefined);

  return (
    <Providers__client>
      <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
    </Providers__client>
  );
}
