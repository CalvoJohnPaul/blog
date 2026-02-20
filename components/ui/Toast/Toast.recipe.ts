import {toastAnatomy} from '@ark-ui/react/toast';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const toastRecipe = tv({
  slots: anatomyToRecipeSlots(toastAnatomy.extendWith('icon'), {
    root: [
      'group',
      'z-(--z-index)',
      'flex',
      'h-(--height)',
      'w-[calc(100dvw-(var(--gap)*2))]',
      'lg:w-124',
      'scale-(--scale)',
      'items-center',
      'gap-2',
      'rounded',
      'p-4',
      'opacity-(--opacity)',
      'transition-all',
      'duration-300',
      '[translate:var(--x)_var(--y)_0]',
      'ui-type-error:bg-rose-50',
      'ui-type-success:bg-emerald-50',
    ],
    title: 'sr-only',
    description:
      'block grow ui-group-type-error:text-rose-600 ui-group-type-success:text-emerald-600',
    closeTrigger: [
      'absolute',
      'top-2',
      'right-2',
      'flex',
      'icon:size-4.5',
      'shrink-0',
      'items-center',
      'transition-colors',
      'duration-300',
      'icon:size-4',
      'ui-group-type-error:text-rose-200',
      'ui-group-type-success:text-emerald-200',
      'ui-group-type-error:hover:text-rose-400',
      'ui-group-type-success:hover:text-emerald-400',
    ],
    icon: 'size-5 ui-group-type-error:text-rose-600 ui-group-type-success:text-emerald-600',
  }),
});
