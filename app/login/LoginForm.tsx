'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {Controller, useForm} from 'react-hook-form';
import {PasswordField} from '~/components/forms/PasswordField';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {toaster} from '~/config/toaster';
import {CreateSessionInputDefinition} from '~/definitions/session';
import {useCreateSessionMutation} from '~/hooks/useCreateSessionMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';

export function LoginForm() {
  const client = getQueryClient();
  const router = useRouter();
  const mutation = useCreateSessionMutation();
  const form = useForm({
    resolver: zodResolver(CreateSessionInputDefinition),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        try {
          await mutation.mutateAsync(data);
          await client.invalidateQueries({queryKey: useMeQuery.getQueryKey()});
          toaster.dismiss();
          router.push('/');
        } catch {
          toaster.error({
            description: 'Account not found.',
          });
        }
      })}
      noValidate
      className="space-y-5"
    >
      <Field.Root invalid={!!form.formState.errors.email}>
        <Field.Input
          size="lg"
          type="email"
          autoComplete="email"
          placeholder="Email"
          {...form.register('email')}
        />
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
          Sign In
        </Button>
      </div>
    </form>
  );
}
