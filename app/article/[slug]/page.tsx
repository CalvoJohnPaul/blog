import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import type {Post} from '~/definitions/post';
import {usePostQuery} from '~/hooks/usePostQuery';
import {findPostBySlug} from '~/services/Post';
import {getQueryClient} from '~/utils/getQueryClient';
import {Page__client} from './page.client';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const {slug} = await props.params;
  const post = await findPostBySlug(slug);

  if (post == null) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      tags: post.tags,
      authors: post.user.name,
      publishedTime: post.createdAt.toISOString(),
    },
  };
}

export default async function Page(props: Props) {
  const {slug} = await props.params;
  const client = getQueryClient();
  await client
    .prefetchQuery({
      queryKey: usePostQuery.getQueryKey(slug),
      queryFn: () => findPostBySlug(slug),
    })
    .catch(() => undefined);

  const post = client.getQueryData<Post | null>(usePostQuery.getQueryKey(slug));

  if (post == null) return notFound();

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Page__client />
    </HydrationBoundary>
  );
}
