import {format} from 'date-fns';
import {Link, Outlet} from 'react-router';
import {Avatar} from '~/components/ui/Avatar';
import {prisma} from '~/config/prisma';
import type {Route} from './+types/Layout';

export async function loader({params, request}: Route.LoaderArgs) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      createdAt: true,
    },
  });

  if (post == null) throw new Response('Not Found', {status: 404});

  return {post, canonicalUrl: new URL(request.url).toString()};
}

export function meta({loaderData}: Route.MetaArgs) {
  const description =
    loaderData.post.description.trim().slice(0, 157) +
    (loaderData.post.description.length > 160 ? '...' : '');

  return [
    {title: `${loaderData.post.title} | Blog`},
    {name: 'description', content: description},
    {property: 'og:title', content: loaderData.post.title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'article'},
    {property: 'og:url', content: loaderData.canonicalUrl},
    {property: 'og:site_name', content: 'Blog'},
    {property: 'article:published_time', content: loaderData.post.createdAt.toISOString()},
    {name: 'twitter:card', content: 'summary'},
    {name: 'keywords', content: loaderData.post.tags.filter(Boolean).join(', ')},
  ];
}

export default function Page({loaderData}: Route.ComponentProps) {
  const {post} = loaderData;

  return (
    <div>
      <section className="bg-gray-50 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl leading-[1.1] font-bold lg:text-[2.8rem] text-gray-800">
            {post.title}
          </h1>
          <div className="mt-8 flex">
            <div className="flex grow items-center gap-2">
              <Avatar.Root className="bg-emerald-100">
                <Avatar.Image src={post.user.image ?? undefined} />
                <Avatar.Fallback className="icon:text-emerald-500" />
              </Avatar.Root>
              <div>
                <Link
                  to={`/profile/${post.user.id}`}
                  className="block font-medium text-gray-600 leading-tight"
                >
                  {post.user.name}
                </Link>
                <div className="text-sm leading-tight text-gray-500">
                  {format(post.createdAt, 'MMM dd, yyyy hh:mm a')}
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
              __html: post.content,
            }}
          />

          <ul className="mt-10 flex gap-1">
            {post.tags.map((tag) => (
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

      <Outlet />
    </div>
  );
}
