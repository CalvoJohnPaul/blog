import {zodResolver} from '@hookform/resolvers/zod';
import {hash} from 'bcrypt';
import {isNil, omitBy} from 'es-toolkit';
import {PartyPopperIcon} from 'lucide-react';
import {Form} from 'react-router';
import {getValidatedFormData, useRemixForm} from 'remix-hook-form';
import * as z from 'zod';
import {Alert} from '~/components/ui/Alert';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {PasswordInput} from '~/components/ui/PasswordInput';
import {prisma} from '~/config/prisma';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Settings';

const resolver = zodResolver(
  z.object({
    bio: z.string().trim().min(4, 'Bio too short').max(100, 'Bio too long').or(z.literal('')),
    name: z.string().trim().min(2, 'Name too short').max(50, 'Name too long').or(z.literal('')),
    email: z.email().max(200, 'Email too long').or(z.literal('')),
    image: z.url().max(500, 'Image url too long').or(z.literal('')),
    password: z
      .string()
      .trim()
      .min(8, 'Password too short')
      .max(150, 'Password too long')
      .or(z.literal('')),
  }),
);

export async function action({request}: Route.ActionArgs) {
  const {errors, data} = await getValidatedFormData(request, resolver);

  if (errors) return new Response('Bad request', {status: 400});

  const session = await getSession(request.headers.get('Cookie'));
  const input = omitBy(data, (v) => isNil(v) || v === '');

  await prisma.user.update({
    where: {id: session.data.user},
    data: {
      ...input,
      password: input.password ? await hash(input.password, 8) : undefined,
    },
    select: {
      id: true,
    },
  });

  return {ok: true};
}

export async function loader({request}: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const user = await prisma.user.findUniqueOrThrow({
    where: {id: session.data.user},
    select: {
      id: true,
      bio: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return {user};
}

export default function Page({actionData, loaderData}: Route.ComponentProps) {
  const {user} = loaderData;
  const form = useRemixForm({
    resolver,
    defaultValues: {
      bio: user.bio ?? '',
      name: user.name,
      email: user.email,
      image: user.image ?? '',
      password: '',
    },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-center text-4xl">Your Settings</h1>

      <Form method="POST" onSubmit={form.handleSubmit} className="mt-6 space-y-4">
        {!!actionData?.ok && (
          <div>
            <Alert.Root>
              <Alert.Icon>
                <PartyPopperIcon />
              </Alert.Icon>
              <Alert.Label>Changes have been saved</Alert.Label>
            </Alert.Root>
          </div>
        )}

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
        <Field.Root invalid={!!form.formState.errors.password}>
          <PasswordInput.Root
            size="lg"
            autoComplete="current-password"
            {...form.register('password')}
          >
            <PasswordInput.Control>
              <PasswordInput.Input placeholder="New Password" />
              <PasswordInput.VisibilityTrigger>
                <PasswordInput.Indicator />
              </PasswordInput.VisibilityTrigger>
            </PasswordInput.Control>
          </PasswordInput.Root>
          <Field.ErrorText>{form.formState.errors.password?.message}</Field.ErrorText>
        </Field.Root>

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
      </Form>

      <Form method="DELETE" action="/logout" className="mt-5 border-t border-gray-200 pt-5">
        <button
          type="submit"
          className="rounded border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
        >
          Or click here to logout.
        </button>
      </Form>
    </div>
  );
}
