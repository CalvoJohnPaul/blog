import {zodResolver} from '@hookform/resolvers/zod';
import {format} from 'date-fns';
import {FrownIcon, TrashIcon} from 'lucide-react';
import {useEffect} from 'react';
import {Form, Link} from 'react-router';
import {getValidatedFormData, useRemixForm} from 'remix-hook-form';
import * as z from 'zod';
import {Alert} from '~/components/ui/Alert';
import {Avatar} from '~/components/ui/Avatar';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {prisma} from '~/config/prisma';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Comments';

const resolver = zodResolver(
  z.object({
    postId: z.number(),
    content: z.string().trim().min(2, 'Comment too short').max(250, 'Comment too long'),
  }),
);

export async function action({request}: Route.ActionArgs) {
  const method = request.method.toUpperCase();
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('user');

  if (userId == null) return new Response('Unauthorized', {status: 401});

  if (method === 'POST') {
    const {errors, data} = await getValidatedFormData(request, resolver);

    if (errors) return new Response('Bad request', {status: 400});

    await prisma.comment.create({
      data: {
        userId,
        postId: data.postId,
        content: data.content,
      },
      select: {
        id: true,
      },
    });

    return;
  }

  if (method === 'DELETE') {
    const data = await request.formData();
    const id = z
      .string()
      .transform((v) => {
        const n = parseInt(v);
        return Number.isNaN(n) ? null : n;
      })
      .parse(data.get('id'));

    if (id == null) return {error: 'Invalid input'};

    await prisma.comment.delete({where: {id}});

    return;
  }

  return new Response('Not found', {status: 404});
}

export async function loader({request, params}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const postQuery = prisma.post.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
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
          createdAt: 'desc',
        },
      },
    },
  });

  const [post, user] = session.data.user
    ? await prisma.$transaction([
        postQuery,
        prisma.user.findUnique({
          where: {id: session.data.user},
          select: {
            id: true,
            name: true,
            image: true,
          },
        }),
      ])
    : [await postQuery, null];

  if (post == null) throw new Response('Not Found', {status: 404});

  return {post, user};
}

export default function Page({loaderData, actionData}: Route.ComponentProps) {
  const {post, user} = loaderData;
  const form = useRemixForm({
    resolver,
    defaultValues: {
      postId: post.id,
      content: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.reset();
    }
  }, [form]);

  return (
    <section className="mx-auto mt-12 max-w-3xl space-y-3 px-4">
      {!!actionData?.error && (
        <Alert.Root accent="danger">
          <Alert.Icon>
            <FrownIcon />
          </Alert.Icon>
          <Alert.Label>{actionData.error}</Alert.Label>
        </Alert.Root>
      )}

      {user != null && (
        <Field.Root>
          <Form
            method="POST"
            onSubmit={form.handleSubmit}
            className="overflow-hidden rounded border border-gray-200"
          >
            <input type="hidden" {...form.register('postId')} />
            <Field.Root invalid={!!form.formState.errors.content}>
              <Field.Textarea
                placeholder="Write a comment..."
                autoresize
                className="block w-full p-5 outline-none placeholder:text-gray-400"
                unstyled
                {...form.register('content')}
              />
            </Field.Root>

            <div className="flex items-center border-t border-gray-200 bg-gray-50 px-5 py-3">
              <Avatar.Root>
                <Avatar.Image src={user.image ?? undefined} />
                <Avatar.Fallback />
              </Avatar.Root>
              <div className="grow" />
              <Button
                size="sm"
                type="submit"
                className="font-bold"
                disabled={form.formState.isSubmitting}
              >
                Post Comment
              </Button>
            </div>
          </Form>
        </Field.Root>
      )}

      {post.comments.map((comment) => (
        <div key={comment.id} className="overflow-hidden rounded border border-gray-200">
          <p className="p-5 text-gray-600">{comment.content}</p>

          <div className="flex items-center gap-1.5 border-t border-gray-200 bg-gray-50 px-5 py-3">
            <Avatar.Root>
              <Avatar.Image src={comment.user.image ?? undefined} />
              <Avatar.Fallback />
            </Avatar.Root>
            <Link
              to={`/profile/${comment.user.id}`}
              className="text-sm leading-none text-emerald-500"
            >
              {comment.user.name}
            </Link>
            <div className="text-sm leading-none text-gray-400">
              {format(comment.createdAt, 'MMM dd, yyyy hh:mm a')}
            </div>
            <div className="grow" />
            {comment.user.id === user?.id && (
              <Form method="DELETE" className="flex">
                <input type="hidden" name="id" value={comment.id} />
                <button type="submit" className="text-red-400" title="Delete Comment">
                  <TrashIcon className="size-4" />
                  <span className="sr-only">Delete comment</span>
                </button>
              </Form>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
