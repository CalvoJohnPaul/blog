'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {invariant} from 'es-toolkit';
import {useRouter} from 'next/navigation';
import {Controller, useForm} from 'react-hook-form';
import {RichTextField} from '~/components/forms/RichTextField';
import {TagsField} from '~/components/forms/TagsField';
import {TextField} from '~/components/forms/TextField';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';
import {CreatePostInputDefinition} from '~/definitions/post';
import {useCreatePostMutation} from '~/hooks/useCreatePostMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {getQueryClient} from '~/utils/getQueryClient';

export function EditorForm() {
  const client = getQueryClient();
  const router = useRouter();
  const query = useMeQuery();
  const form = useForm({
    resolver: zodResolver(CreatePostInputDefinition.omit({userId: true})),
    defaultValues: {
      content: '',
      description: '',
      title: '',
      tags: [],
    },
  });

  const mutation = useCreatePostMutation();

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        invariant(query.data, "User is 'undefined'");

        try {
          const post = await mutation.mutateAsync({
            ...data,
            userId: query.data.id,
          });

          client.invalidateQueries({
            queryKey: usePostsQuery.getQueryKey(),
            exact: false,
            type: 'all',
            refetchType: 'active',
          });

          router.push(`/article/${post.slug}`);
        } catch (e) {
          toaster.error({
            description: e instanceof Error ? e.message : 'Failed to create post',
          });
        }
      })}
      noValidate
      className="space-y-4"
    >
      <Controller
        control={form.control}
        name="title"
        render={(ctx) => (
          <Field.Root invalid={ctx.fieldState.invalid}>
            <TextField
              size="lg"
              placeholder="Article Title"
              value={ctx.field.value}
              onChange={ctx.field.onChange}
            />
            <Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
      <Controller
        control={form.control}
        name="description"
        render={(ctx) => (
          <Field.Root invalid={ctx.fieldState.invalid}>
            <Field.Textarea
              placeholder="What's this article about?"
              value={ctx.field.value}
              onChange={ctx.field.onChange}
              autoresize
            />
            <Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
      <Controller
        control={form.control}
        name="content"
        render={(ctx) => (
          <Field.Root invalid={ctx.fieldState.invalid}>
            <RichTextField
              value={ctx.field.value}
              onChange={ctx.field.onChange}
              placeholder="Write your article"
            />
            <Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />
      <Controller
        control={form.control}
        name="tags"
        render={(ctx) => (
          <Field.Root invalid={ctx.fieldState.invalid}>
            <TagsField
              value={ctx.field.value}
              onChange={ctx.field.onChange}
              placeholder="Enter tags"
            />
            <Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />

      <div className="lg:flex lg:justify-end">
        <Button
          size="lg"
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full lg:w-auto"
        >
          Publish Article
        </Button>
      </div>
    </form>
  );
}
