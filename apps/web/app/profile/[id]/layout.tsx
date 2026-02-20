import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import type {ReactNode} from 'react';
import {findUser} from '~/app/services/User';
import {IdDefinition} from '~/definitions/common';
import type {User} from '~/definitions/user';
import {useUserQuery} from '~/hooks/useUserQuery';
import {getQueryClient} from '~/utils/getQueryClient';
import {Menu} from './Menu';
import {Profile} from './Profile';

interface Props {
  params: Promise<{id: string}>;
  children: ReactNode;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const userId = IdDefinition.nullable().optional().catch(null).parse(params.id);
  const user = userId == null ? null : await findUser(userId);

  if (user == null) return {};

  return {
    title: user.name,
    description: user.bio,
  };
}

export default async function Layout(props: Props) {
  const params = await props.params;
  const userId = IdDefinition.nullable().optional().catch(null).parse(params.id);

  if (userId == null) return notFound();

  const client = getQueryClient();
  await client.prefetchQuery({
    queryKey: useUserQuery.getQueryKey(userId),
    queryFn: () => findUser(userId),
  });

  const user = client.getQueryData<User>(useUserQuery.getQueryKey(userId));

  if (user == null) return notFound();

  return (
    <div>
      <HydrationBoundary state={dehydrate(client)}>
        <Profile />
        <section className="mx-auto mt-10 max-w-3xl px-4">
          <Menu />
          {props.children}
        </section>
      </HydrationBoundary>
    </div>
  );
}
