import {passwordInputAnatomy} from '@ark-ui/react/password-input';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const passwordInputRecipe = tv({
  slots: anatomyToRecipeSlots(passwordInputAnatomy, {
    control: [
      'flex',
      'rounded',
      'border',
      'border-gray-200',
      'ui-invalid:border-rose-400',
      'focus-within:border-emerald-400',
    ],
    input: 'grow outline-none [&::-ms-clear]:hidden [&::-ms-reveal]:hidden',
    visibilityTrigger: 'flex shrink-0 items-center justify-center',
    indicator: 'text-gray-600',
  }),
  variants: {
    size: {
      md: {
        input: 'h-11 px-3.5',
        visibilityTrigger: 'icon:size-5 size-11',
      },
      lg: {
        input: 'h-12 px-4 text-lg',
        visibilityTrigger: 'icon:size-6 size-12',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
