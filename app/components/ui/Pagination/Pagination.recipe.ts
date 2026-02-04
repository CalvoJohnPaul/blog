import {paginationAnatomy} from '@ark-ui/react';
import clsx from 'clsx';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

const trigger = clsx(
  'border border-gray-200 text-emerald-500 data-selected:border-emerald-500 data-selected:bg-emerald-500 flex items-center justify-center icon:size-5 min-w-11 h-11 rounded data-selected:text-white disabled:cursor-not-allowed disabled:opacity-65',
);

export const paginationRecipe = tv({
  slots: anatomyToRecipeSlots(paginationAnatomy, {
    root: 'flex gap-2',
    ellipsis: 'flex icon:size-4 size-11 items-center justify-center text-gray-300',
    item: trigger,
    firstTrigger: trigger,
    lastTrigger: trigger,
    nextTrigger: trigger,
    prevTrigger: trigger,
  }),
});
