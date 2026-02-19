'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {PasswordInput} from '~/components/ui/PasswordInput';
import {toaster} from '~/config/toaster';
import {CreateSessionInputDefinition} from '~/definitions/session';
import {useCreateSessionMutation} from '~/hooks/useCreateSessionMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {getQueryClient} from '~/utils/getQueryClient';

export function LoginForm() {
  const queryClient = getQueryClient();

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
          await queryClient.invalidateQueries({queryKey: useMeQuery.getQueryKey()});
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
      <Field.Root invalid={!!form.formState.errors.password}>
        <PasswordInput.Root
          size="lg"
          autoComplete="current-password"
          {...form.register('password')}
        >
          <PasswordInput.Control>
            <PasswordInput.Input placeholder="Password" />
            <PasswordInput.VisibilityTrigger>
              <PasswordInput.Indicator />
            </PasswordInput.VisibilityTrigger>
          </PasswordInput.Control>
        </PasswordInput.Root>
        <Field.ErrorText>{form.formState.errors.password?.message}</Field.ErrorText>
      </Field.Root>
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
