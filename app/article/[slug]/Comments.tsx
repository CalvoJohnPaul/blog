import {zodResolver} from '@hookform/resolvers/zod';
import {format} from 'date-fns';
import {invariant} from 'es-toolkit';
import {TrashIcon} from 'lucide-react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {Avatar} from '~/components/ui/Avatar';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';
import {type Comment, CreateCommentInputDefinition} from '~/definitions/comment';
import type {Paginated} from '~/definitions/common';
import {useCommentsQuery} from '~/hooks/useCommentsQuery';
import {useCreateCommentMutation} from '~/hooks/useCreateCommentMutation';
import {useDeleteCommentMutation} from '~/hooks/useDeleteCommentMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';

export function Comments({post}: {post: number}) {
  const client = getQueryClient();

  const form = useForm({
    resolver: zodResolver(CreateCommentInputDefinition.pick({content: true})),
    defaultValues: {
      content: '',
    },
  });

  const meQuery = useMeQuery();
  const commentsQuery = useCommentsQuery({
    page: 1,
    pageSize: 100,
    postId__eq: post,
  });

  const createCommentMutation = useCreateCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();

  return (
    <section className="mx-auto mt-12 max-w-3xl space-y-3 px-4">
      {meQuery.data != null && (
        <div>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              invariant(meQuery.data != null, 'Unauthenticated');

              try {
                await createCommentMutation.mutateAsync({
                  content: data.content,
                  postId: post,
                  userId: meQuery.data.id,
                });

                await commentsQuery.refetch();
                form.reset();
              } catch (error) {
                toaster.error({
                  description: error instanceof Error ? error.message : 'Failed to post comment',
                });
              }
            })}
            className="overflow-hidden rounded border border-gray-200"
          >
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
                {meQuery.data?.image && <Avatar.Image src={meQuery.data.image} />}
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
          </form>
          {form.formState.errors.content && (
            <p className="mt-1 text-sm text-red-500">{form.formState.errors.content.message}</p>
          )}
        </div>
      )}

      {commentsQuery.data?.rows.map((comment) => (
        <div key={comment.id} className="overflow-hidden rounded border border-gray-200">
          <p className="p-5 text-gray-600">{comment.content}</p>

          <div className="flex items-center gap-1.5 border-t border-gray-200 bg-gray-50 px-5 py-3">
            <Avatar.Root>
              {comment.user.image && <Avatar.Image src={comment.user.image} />}
              <Avatar.Fallback />
            </Avatar.Root>
            <Link
              href={`/profile/${comment.user.id}`}
              className="text-sm leading-none text-emerald-500"
            >
              {comment.user.name}
            </Link>
            <div className="text-sm leading-none text-gray-400">
              {format(comment.createdAt, 'MMM dd, yyyy hh:mm a')}
            </div>
            <div className="grow" />
            {comment.user.id === meQuery.data?.id && (
              <button
                type="button"
                className="text-red-400"
                onClick={async () => {
                  try {
                    await deleteCommentMutation.mutateAsync(comment.id);
                    client.setQueryData<Paginated<Comment>>(
                      useCommentsQuery.getQueryKey({
                        page: 1,
                        pageSize: 100,
                        postId__eq: post,
                      }),
                      (prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          rows: prev.rows.filter(({id}) => id !== comment.id),
                        };
                      },
                    );
                  } catch (error) {
                    toaster.error({
                      description:
                        error instanceof Error ? error.message : 'Failed to delete comment',
                    });
                  }
                }}
              >
                <TrashIcon className="size-4" />
                <span className="sr-only">Delete comment</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
