'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import {useTimeout} from 'usehooks-ts';
import {PasswordField} from '~/components/forms/PasswordField';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';
import {UpdateUserDataInputDefinition, type User} from '~/definitions/user';
import {useMeQuery} from '~/hooks/useMeQuery';
import {useUpdateMeMutation} from '~/hooks/useUpdateMeMutation';
import {getQueryClient} from '~/utils/getQueryClient';

export function SettingsForm() {
  const client = getQueryClient();
  const form = useForm({
    resolver: zodResolver(UpdateUserDataInputDefinition),
    defaultValues: {
      bio: '',
      name: '',
      email: '',
      image: '',
      password: '',
    },
  });

  const query = useMeQuery();
  const mutation = useUpdateMeMutation();

  useTimeout(
    () => {
      form.reset({
        bio: query.data?.bio ?? '',
        name: query.data?.name ?? '',
        email: query.data?.email ?? '',
        image: query.data?.image ?? '',
        password: '',
      });
    },
    query.data == null ? null : 1,
  );

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        try {
          const user = await mutation.mutateAsync(data);

          client.setQueryData<User>(useMeQuery.getQueryKey(), user);
          form.reset(data);
          toaster.success({description: 'Changes have been saved.'});
        } catch (e) {
          toaster.error({
            description: e instanceof Error ? e.message : 'Failed to update profile.',
          });
        }
      })}
      className="mt-6 space-y-4"
    >
      <Field.Root invalid={!!form.formState.errors.image}>
        <Field.Input placeholder="URL of profile picture" {...form.register('image')} />
        <Field.ErrorText>{form.formState.errors.image?.message}</Field.ErrorText>
      </Field.Root>
      <Field.Root invalid={!!form.formState.errors.name}>
        <Field.Input size="lg" placeholder="Your name" {...form.register('name')} />
        <Field.ErrorText>{form.formState.errors.name?.message}</Field.ErrorText>
      </Field.Root>
      <Field.Root invalid={!!form.formState.errors.bio}>
        <Field.Textarea
          size="lg"
          placeholder="Short bio about you"
          autoresize
          {...form.register('bio')}
        />
        <Field.ErrorText>{form.formState.errors.bio?.message}</Field.ErrorText>
      </Field.Root>
      <Field.Root invalid={!!form.formState.errors.email}>
        <Field.Input size="lg" type="email" placeholder="Email" {...form.register('email')} />
        <Field.ErrorText>{form.formState.errors.email?.message}</Field.ErrorText>
      </Field.Root>
      <Controller
        control={form.control}
        name="password"
        render={(ctx) => (
          <Field.Root invalid={ctx.fieldState.invalid}>
            <PasswordField
              size="lg"
              placeholder="Password"
              value={ctx.field.value}
              onChange={ctx.field.onChange}
            />
            <Field.ErrorText>{ctx.fieldState.error?.message}</Field.ErrorText>
          </Field.Root>
        )}
      />

      <div className="lg:flex lg:justify-end">
        <Button
          type="submit"
          size="lg"
          className="w-full lg:w-auto"
          disabled={form.formState.isSubmitting}
        >
          Update Settings
        </Button>
      </div>
    </form>
  );
}
