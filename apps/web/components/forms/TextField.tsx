'use client';

import {useFieldContext} from '@ark-ui/react';
import {useControllableState} from '@radix-ui/react-use-controllable-state';
import clsx from 'clsx';
import {dataAttr} from '~/utils/dataAttr';
import {fieldRecipe} from '../ui/Field/Field.recipe';

export interface TextFieldProps {
  size?: 'md' | 'lg';
  type?: 'text' | 'email';
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
}

export function TextField(props: TextFieldProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? '',
    onChange: props.onChange,
  });

  const field = useFieldContext();

  return (
    <input
      id={field?.ids?.control}
      type={props.type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={props.placeholder}
      className={clsx(fieldRecipe().input({size: props.size}), props.className)}
      disabled={props.disabled || field?.disabled}
      readOnly={props.readOnly || field?.readOnly}
      required={props.required || field?.required}
      aria-invalid={props.invalid || field?.invalid}
      aria-describedby={field?.ariaDescribedby}
      data-disabled={dataAttr(props.disabled || field?.disabled)}
      data-readonly={dataAttr(props.readOnly || field?.readOnly)}
      data-required={dataAttr(props.required || field?.required)}
      data-invalid={dataAttr(props.invalid || field?.invalid)}
    />
  );
}
