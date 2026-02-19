'use client';

import {useControllableState} from '@radix-ui/react-use-controllable-state';
import {TagsInput} from '../ui/TagsInput';

export interface TagsFieldProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  required?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function TagsField(props: TagsFieldProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? [],
    onChange: props.onChange,
  });

  return (
    <TagsInput.Root
      value={value}
      onValueChange={(details) => setValue(details.value)}
      invalid={props.invalid}
      readOnly={props.readOnly}
      disabled={props.disabled}
      required={props.required}
      className={props.className}
      placeholder={props.placeholder}
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
        <TagsInput.Input />
        <TagsInput.ClearTrigger />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput.Root>
  );
}
