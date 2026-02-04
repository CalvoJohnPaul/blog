import {zodResolver} from '@hookform/resolvers/zod';
import {hash} from 'bcrypt';
import {FrownIcon} from 'lucide-react';
import {Form, Link, redirect} from 'react-router';
import {getValidatedFormData, useRemixForm} from 'remix-hook-form';
import * as z from 'zod';
import {Alert} from '~/components/ui/Alert';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {prisma} from '~/config/prisma';
import {commitSession, getSession} from '~/utils/session';
import type {Route} from './+types/Register';

const resolver = zodResolver(
  z.object({
    name: z.string().trim().min(2, 'Name too short').max(50, 'Name too long'),
    email: z.email().max(200, 'Email too long'),
    password: z.string().trim().min(8, 'Password too short').max(150, 'Password too long'),
  }),
);

export async function action({request}: Route.ActionArgs) {
  if (request.method.toUpperCase() !== 'POST') return new Response('Not found', {status: 404});

  const session = await getSession(request.headers.get('Cookie'));
  const {errors, data} = await getValidatedFormData(request, resolver);

  if (errors) return new Response('Bad request', {status: 400});

  const {name, email, password} = data;
  const exists = await prisma.user.exists({email});

  if (exists) {
    return {
      error: 'Email is already taken',
    };
  }
  const {id} = await prisma.user.create({
    data: {
      name,
      email,
      password: await hash(password, 8),
    },
    select: {
      id: true,
    },
  });

  session.set('user', id);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function Page({actionData}: Route.ComponentProps) {
  const form = useRemixForm({
    resolver,
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl">Sign Up</h1>
        <Link to="/login" className="text-emerald-500">
          Have an account?
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
          <Field.Root invalid={!!form.formState.errors.name}>
            <Field.Input size="lg" placeholder="Name" {...form.register('name')} />
            <Field.ErrorText>{form.formState.errors.name?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!form.formState.errors.email}>
            <Field.Input size="lg" type="email" placeholder="Email" {...form.register('email')} />
            <Field.ErrorText>{form.formState.errors.email?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!form.formState.errors.password}>
            <Field.Input
              size="lg"
              type="password"
              placeholder="Password"
              {...form.register('password')}
            />
            <Field.ErrorText>{form.formState.errors.password?.message}</Field.ErrorText>
          </Field.Root>
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
        </Form>
      </div>
    </div>
  );
}
