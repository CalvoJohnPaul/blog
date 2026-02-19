'use client';

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
import {Wysiwyg} from '../ui/Wysiwyg';

export interface RichTextFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function RichTextField(props: RichTextFieldProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? '',
    onChange: props.onChange,
  });

  return (
    <Wysiwyg.Root
      value={value}
      onValueChange={(details) => setValue(details.value)}
      invalid={props.invalid}
      readOnly={props.readOnly}
      disabled={props.disabled}
      required={props.required}
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
