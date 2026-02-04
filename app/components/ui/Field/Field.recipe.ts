import {fieldAnatomy} from '@ark-ui/react/field';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const fieldRecipe = tv({
  slots: anatomyToRecipeSlots(fieldAnatomy, {
    input:
      'block w-full outline-none rounded border border-gray-200 transition-colors duration-200 placeholder:text-gray-400 focus:border-emerald-400 ui-invalid:border-rose-400',
    textarea:
      'block w-full outline-none rounded border border-gray-200 transition-colors duration-200 placeholder:text-gray-400 focus:border-emerald-400 ui-invalid:border-rose-400',
    errorText: 'text-rose-600 mt-1 block',
  }),
  variants: {
    size: {
      md: {
        input: 'h-11 px-3.5',
        textarea: 'px-3.5 py-3',
      },
      lg: {
        input: 'h-12 px-4 text-lg',
        textarea: 'px-4 py-3.5 text-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
