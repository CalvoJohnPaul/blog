import {tagsInputAnatomy} from '@ark-ui/react';
import {tv} from 'tailwind-variants';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

export const tagsInputRecipe = tv({
  slots: anatomyToRecipeSlots(tagsInputAnatomy, {
    control:
      'border px-3.5 py-2 h-11 border-gray-200 gap-1 rounded overflow-hidden flex flex-wrap items-center ui-focus:border-emerald-400 ui-invalid:border-rose-400',
    input: 'outline-none placeholder:text-gray-400 flex-1',
    itemPreview:
      'border text-sm pl-2 pr-1 h-6 text-gray-600 border-gray-200 ui-highlighted:border-gray-300 rounded-sm flex items-center gap-1',
    itemInput: 'border border-gray-200 rounded-sm text-sm outline-none px-2 h-6',
    itemDeleteTrigger: 'icon:size-3 text-neutral-400',
  }),
});
