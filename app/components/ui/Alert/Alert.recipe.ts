import {tv, type VariantProps} from 'tailwind-variants';

export const alertRecipe = tv({
  slots: {
    root: 'flex items-center gap-2 rounded p-4',
    icon: 'size-5',
    label: 'leading-none',
  },
  variants: {
    accent: {
      danger: {
        root: 'bg-rose-50 text-rose-600',
      },
      success: {
        root: 'bg-emerald-50 text-emerald-600',
      },
    },
  },
  defaultVariants: {
    accent: 'success',
  },
});

export type AlertVariants = VariantProps<typeof alertRecipe>;
