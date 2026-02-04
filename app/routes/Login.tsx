import {zodResolver} from '@hookform/resolvers/zod';
import {compare} from 'bcrypt';
import {FrownIcon} from 'lucide-react';
import {Form, Link, redirect} from 'react-router';
import {getValidatedFormData, useRemixForm} from 'remix-hook-form';
import * as z from 'zod';
import {Alert} from '~/components/ui/Alert';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {PasswordInput} from '~/components/ui/PasswordInput';
import {prisma} from '~/config/prisma';
import {commitSession, getSession} from '~/utils/session';
import type {Route} from './+types/Login';

const resolver = zodResolver(
  z.object({
    email: z.email('Invalid email'),
    password: z.string().trim().min(1, 'Invalid password'),
  }),
);

export async function action({request}: Route.ActionArgs) {
  if (request.method.toUpperCase() !== 'POST') return new Response('Not found', {status: 404});

  const session = await getSession(request.headers.get('Cookie'));
  const {errors, data} = await getValidatedFormData(request, resolver);

  if (errors) return new Response('Bad request', {status: 400});

  const {email, password} = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
    },
  });

  const matches = user != null && (await compare(password, user.password));

  if (matches) {
    session.set('user', user.id);

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return {error: 'Account not found'};
}

export default function Page({actionData}: Route.ComponentProps) {
  const form = useRemixForm({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl">Sign In</h1>
        <Link to="/register" className="text-emerald-500">
          Need an account?
        </Link>
      </div>
      <div className="mt-3">
        {!!actionData?.error && (
          <Alert.Root accent="danger" className="mb-5">
            <Alert.Icon>
              <FrownIcon />
            </Alert.Icon>
            <Alert.Label>{actionData.error}</Alert.Label>
          </Alert.Root>
        )}

        <Form method="POST" onSubmit={form.handleSubmit} noValidate className="space-y-5">
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
        </Form>
      </div>
    </div>
  );
}
