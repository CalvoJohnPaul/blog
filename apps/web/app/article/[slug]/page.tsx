'use client';

import {format} from 'date-fns';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {Avatar} from '~/components/ui/Avatar';
import {usePostQuery} from '~/hooks/usePostQuery';
import {Comments} from './Comments';

export default function Page() {
  const params = useParams<{slug: string}>();
  const query = usePostQuery(params.slug);

  if (query.data == null) return null;

  return (
    <div>
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl leading-[1.1] font-bold lg:text-[2.8rem] text-gray-800">
            {query.data.title}
          </h1>
          <div className="mt-8 flex">
            <div className="flex grow items-center gap-2">
              <Avatar.Root className="bg-emerald-100">
                {query.data.user.image && <Avatar.Image src={query.data.user.image} />}
                <Avatar.Fallback className="icon:text-emerald-500" />
              </Avatar.Root>
              <div>
                <Link
                  href={`/profile/${query.data.user.id}`}
                  className="block font-medium text-gray-600 leading-tight"
                >
                  {query.data.user.name}
                </Link>
                <div className="text-sm leading-tight text-gray-500">
                  {format(query.data.createdAt, 'MMM dd, yyyy hh:mm a')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4">
        <div className="border-b border-gray-200 py-8">
          <article
            className="prose max-w-none prose-gray lg:prose-lg prose-p:leading-normal"
            dangerouslySetInnerHTML={{
              __html: query.data.content,
            }}
          />

          <ul className="mt-10 flex gap-1">
            {query.data.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-gray-200 px-2 py-1 text-sm leading-none text-gray-500"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Comments post={query.data.id} />
    </div>
  );
}
