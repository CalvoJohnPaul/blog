import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {cookies} from 'next/headers';
import type {PropsWithChildren} from 'react';
import {prisma} from '~/config/prisma';
import {IdDefinition} from '~/definitions/common';
import type {User} from '~/definitions/user';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';
import {Providers__client} from './Providers.client';

export async function Providers({children}: PropsWithChildren) {
  const store = await cookies();
  const userId = IdDefinition.optional().nullable().catch(null).parse(store.get('user')?.value);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery<User | null>({
    queryKey: useMeQuery.getQueryKey(),
    async queryFn() {
      const user =
        userId == null
          ? null
          : await prisma.user
              .findUnique({
                where: {
                  id: userId,
                },
                select: {
                  id: true,
                  bio: true,
                  name: true,
                  email: true,
                  image: true,
                  createdAt: true,
                  updatedAt: true,
                  followers: {select: {followingId: true}},
                  following: {select: {followerId: true}},
                },
              })
              .then((v) =>
                v == null
                  ? null
                  : {
                      ...v,
                      followers: v.following.map((f) => f.followerId),
                      following: v.followers.map((f) => f.followingId),
                    },
              );

      return user;
    },
  });

  return (
    <Providers__client>
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </Providers__client>
  );
}
