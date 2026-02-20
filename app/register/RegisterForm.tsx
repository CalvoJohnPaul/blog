'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {Controller, useForm} from 'react-hook-form';
import {PasswordField} from '~/components/forms/PasswordField';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';
import {CreateUserInputDefinition, type User} from '~/definitions/user';
import {useCreateUserMutation} from '~/hooks/useCreateUserMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';

export function RegisterForm() {
  const client = getQueryClient();
  const router = useRouter();
  const mutation = useCreateUserMutation();
  const form = useForm({
    resolver: zodResolver(CreateUserInputDefinition),
    defaultValues: {
      bio: '',
      name: '',
      email: '',
      image: '',
      password: '',
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        try {
          const user = await mutation.mutateAsync(data);
          client.setQueryData<User>(useMeQuery.getQueryKey(), user);
          router.push('/');
        } catch (e) {
          toaster.error({
            description: e instanceof Error ? e.message : 'Something went wrong.',
          });
        }
      })}
      noValidate
      className="space-y-5"
    >
      <Field.Root invalid={!!form.formState.errors.name}>
        <Field.Input size="lg" placeholder="Name" {...form.register('name')} />
        <Field.ErrorText>{form.formState.errors.name?.message}</Field.ErrorText>
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
          size="lg"
          type="submit"
          className="w-full lg:w-32"
          disabled={form.formState.isSubmitting}
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}
