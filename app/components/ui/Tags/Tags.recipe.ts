import {tv} from 'tailwind-variants';

export const tagsRecipe = tv({
  slots: {
    root: 'flex flex-wrap gap-1.5',
    item: [
      'text-sm',
      'font-medium',
      'inline-flex',
      'items-center',
      'gap-0.5',
      'border',
      'bg-gray-700/25',
      'px-2.5',
      'py-1',
      'rounded-md',
    ],
    itemText: 'text-gray-300',
    itemCloseTrigger: 'flex icon:size-4 h-2.5 items-center justify-center pl-1 icon:text-gray-400',
  },
});
