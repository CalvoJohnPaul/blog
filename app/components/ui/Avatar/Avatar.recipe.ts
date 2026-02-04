import {avatarAnatomy} from '@ark-ui/react/avatar';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const avatarRecipe = tv({
  slots: anatomyToRecipeSlots(avatarAnatomy, {
    root: 'flex items-center justify-center overflow-hidden rounded-full bg-emerald-50',
    fallback: 'font-medium icon:text-emerald-500 text-emerald-300',
    image: 'size-full object-cover object-center',
  }),
  variants: {
    size: {
      md: {
        root: 'size-10',
        fallback: 'icon:size-6 text-base',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
