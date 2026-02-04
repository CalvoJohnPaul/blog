import type {Assign, HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {forwardRef, useMemo} from 'react';
import type {VariantProps} from 'tailwind-variants';
import {splitProps} from '~/utils/splitProps';
import {buttonRecipe} from './Button.recipe';

export interface ButtonProps
  extends Assign<HTMLArkProps<'button'>, VariantProps<typeof buttonRecipe>> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const [recipeProps, localProps] = useMemo(
    () => splitProps(props, ...buttonRecipe.variantKeys),
    [props],
  );

  return (
    <ark.button
      ref={ref}
      type="button"
      {...localProps}
      className={buttonRecipe({
        ...recipeProps,
        className: localProps.className,
      })}
    />
  );
});

Button.displayName = 'Button';
