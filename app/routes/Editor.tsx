import {zodResolver} from '@hookform/resolvers/zod';
import {useControllableState} from '@radix-ui/react-use-controllable-state';
import {
  BoldIcon,
  CornerDownLeftIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import {Controller} from 'react-hook-form';
import {Form, redirect} from 'react-router';
import {getValidatedFormData, useRemixForm} from 'remix-hook-form';
import slugify from 'slugify';
import * as z from 'zod';
import {Button} from '~/components/ui/Button';
import {Field} from '~/components/ui/Field';
import {TagsInput} from '~/components/ui/TagsInput';
import {Wysiwyg} from '~/components/ui/Wysiwyg';
import {prisma} from '~/config/prisma';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Editor';

const resolver = zodResolver(
  z.object({
    title: z.string().trim().min(4, 'Title too short').max(150, 'Title too long'),
    description: z
      .string()
      .trim()
      .min(10, 'Description too short')
      .max(500, 'Description too long'),
    content: z.string().trim().min(1, 'Content too short'),
    tags: z
      .array(z.string().min(2, 'Tag too short').max(25, 'Tag too long'))
      .min(1, 'Please add atleast 1 tag'),
  }),
);

export async function action({request}: Route.ActionArgs) {
  if (request.method.toUpperCase() !== 'POST') return new Response('Not found', {status: 404});

  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.data.user;

  if (!userId) return {error: 'Not authenticated'};

  const {errors, data} = await getValidatedFormData(request, resolver);

  if (errors) return new Response('Bad request', {status: 400});

  const {title, content, description, tags} = data;
  const slug = slugify(title, {
    trim: true,
    lower: true,
  });

  const post = await prisma.post.create({
    data: {
      slug,
      title,
      description,
      content,
      tags,
      userId,
    },
    select: {
      slug: true,
    },
  });

  return redirect(`/article/${post.slug}`);
}

export default function Page() {
  const form = useRemixForm({
    resolver,
    defaultValues: {
      title: '',
      description: '',
      content: '',
      tags: [],
    },
    mode: 'onSubmit',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Form method="POST" onSubmit={form.handleSubmit} noValidate className="space-y-4">
        <Field.Root invalid={!!form.formState.errors.title}>
          <Field.Input size="lg" placeholder="Article Title" {...form.register('title')} />
          <Field.ErrorText>{form.formState.errors.title?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!form.formState.errors.title}>
          <Field.Input placeholder="What's this article about?" {...form.register('description')} />
          <Field.ErrorText>{form.formState.errors.description?.message}</Field.ErrorText>
        </Field.Root>
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
          <Button size="lg" type="submit" className="w-full lg:w-auto">
            Publish Article
          </Button>
        </div>
      </Form>
    </div>
  );
}

function TagsField(props: {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? [],
    onChange: props.onChange,
  });

  return (
    <TagsInput.Root
      value={value}
      onValueChange={(details) => setValue(details.value)}
      className={props.className}
    >
      <TagsInput.Control>
        <TagsInput.Context>
          {(api) => (
            <>
              {api.value.map((value, index) => (
                <TagsInput.Item key={index} index={index} value={value}>
                  <TagsInput.ItemPreview>
                    <TagsInput.ItemText>{value}</TagsInput.ItemText>
                    <TagsInput.ItemDeleteTrigger />
                  </TagsInput.ItemPreview>
                  <TagsInput.ItemInput />
                </TagsInput.Item>
              ))}
            </>
          )}
        </TagsInput.Context>
        <TagsInput.Input placeholder={props.placeholder} />
        <TagsInput.ClearTrigger />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}

function RichTextField(props: {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? '',
    onChange: props.onChange,
  });

  return (
    <Wysiwyg.Root
      value={value}
      onValueChange={(details) => setValue(details.value)}
      placeholder={props.placeholder}
      className={props.className}
    >
      <Wysiwyg.Control>
        <Wysiwyg.HeadingTrigger level={1} title="Heading 1">
          <Heading1Icon />
        </Wysiwyg.HeadingTrigger>
        <Wysiwyg.HeadingTrigger level={2} title="Heading 2">
          <Heading2Icon />
        </Wysiwyg.HeadingTrigger>
        <Wysiwyg.HeadingTrigger level={3} title="Heading 3">
          <Heading3Icon />
        </Wysiwyg.HeadingTrigger>
        <Wysiwyg.HeadingTrigger level={4} title="Heading 4">
          <Heading4Icon />
        </Wysiwyg.HeadingTrigger>
        <Wysiwyg.HeadingTrigger level={5} title="Heading 5">
          <Heading5Icon />
        </Wysiwyg.HeadingTrigger>
        <Wysiwyg.HeadingTrigger level={6} title="Heading 6">
          <Heading6Icon />
        </Wysiwyg.HeadingTrigger>
        <Wysiwyg.BoldTrigger title="Bold">
          <BoldIcon />
        </Wysiwyg.BoldTrigger>
        <Wysiwyg.ItalicTrigger title="Italic">
          <ItalicIcon />
        </Wysiwyg.ItalicTrigger>
        <Wysiwyg.UnderlineTrigger title="Underline">
          <UnderlineIcon />
        </Wysiwyg.UnderlineTrigger>
        <Wysiwyg.StrikeTrigger title="Strike">
          <StrikethroughIcon />
        </Wysiwyg.StrikeTrigger>
        <Wysiwyg.OrderedListTrigger title="Ordered List">
          <ListOrderedIcon />
        </Wysiwyg.OrderedListTrigger>
        <Wysiwyg.BulletListTrigger title="Bullet List">
          <ListIcon />
        </Wysiwyg.BulletListTrigger>
        <Wysiwyg.HardBreakTrigger title="Hard Break">
          <CornerDownLeftIcon />
        </Wysiwyg.HardBreakTrigger>
      </Wysiwyg.Control>
      <Wysiwyg.Content />
      <Wysiwyg.CharactersCount />
    </Wysiwyg.Root>
  );
}
