import {tv} from 'tailwind-variants';

export const buttonRecipe = tv({
  base: 'rounded transition-colors duration-200 disabled:opacity-45',
  variants: {
    size: {
      xs: 'h-9 min-w-9 px-2.5  text-sm',
      sm: 'h-10 min-w-10 px-3 text-sm',
      md: 'h-11 min-w-11 px-3.5 text-base',
      lg: 'h-12 min-w-12 px-4 text-lg',
    },
    variant: {
      solid: 'bg-emerald-500 text-white',
      outline:
        'border border-gray-200 text-emerald-500 hover:bg-gray-50 data-selected:border-emerald-500 data-selected:bg-emerald-500 data-selected:text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
});
