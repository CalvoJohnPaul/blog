'use client';

import {useControllableState} from '@radix-ui/react-use-controllable-state';
import {PasswordInput} from '../ui/PasswordInput';

export interface PasswordFieldProps {
  size?: 'md' | 'lg';
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

export function PasswordField(props: PasswordFieldProps) {
  const [value, setValue] = useControllableState({
    prop: props.value,
    defaultProp: props.defaultValue ?? '',
    onChange: props.onChange,
  });

  return (
    <PasswordInput.Root
      size={props.size}
      invalid={props.invalid}
      disabled={props.disabled}
      readOnly={props.readOnly}
      required={props.required}
      className={props.className}
    >
      <PasswordInput.Control>
        <PasswordInput.Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={props.placeholder}
        />
        <PasswordInput.VisibilityTrigger>
          <PasswordInput.Indicator />
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Control>
    </PasswordInput.Root>
  );
}
