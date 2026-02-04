import clsx from 'clsx';
import {tv} from 'tailwind-variants';
import {wysiwygAnatomy} from '~/components/core/Wysiwyg';
import {anatomyToRecipeSlots} from '~/utils/anatomyToRecipeSlots';

const trigger = clsx`p-1 transition-colors duration-200 ui-pressed:text-emerald-500 text-gray-600 icon:size-4`;

export const wysiwygRecipe = tv({
  slots: anatomyToRecipeSlots(wysiwygAnatomy, {
    root: [
      'relative',
      'rounded',
      'outline-none',
      'border',
      'border-gray-200',
      'focus-within:border-emerald-400',
      'ui-invalid:border-rose-400',
    ],
    control: 'flex items-center gap-1 rounded-t border-b border-gray-100 p-1.5',
    content: [
      'tiptap:rounded-b',

      'tiptap:min-h-32',
      'tiptap:overflow-y-auto',

      'max-w-full',
      'min-w-full',

      'prose',
      'prose-md',
      'prose-gray',

      'tiptap:px-4',
      'tiptap:py-3',
      'tiptap:scrollbar:bg-transparent',
      'tiptap:scrollbar-thumb:bg-gray-700',
      'tiptap:scrollbar-thumb:border-4',
      'tiptap:scrollbar-thumb:border-transparent',
      'tiptap:scrollbar-thumb:bg-clip-padding',
      'tiptap:scrollbar-thumb:rounded-full',

      'tiptap:[&_p.is-empty]:relative',
      'tiptap:[&_p.is-empty]:before:absolute',
      'tiptap:[&_p.is-empty]:before:content-[attr(data-placeholder)]',
      'tiptap:[&_p.is-empty]:before:pointer-events-none',
      'tiptap:[&_p.is-empty]:before:text-gray-400',
      'tiptap:[&_p.is-empty]:text-md',
    ],
    blockquoteTrigger: trigger,
    boldTrigger: trigger,
    bulletListTrigger: trigger,
    codeBlockTrigger: trigger,
    hardBreakTrigger: trigger,
    headingTrigger: trigger,
    imageTrigger: trigger,
    italicTrigger: trigger,
    linkTrigger: trigger,
    orderedListTrigger: trigger,
    redoTrigger: trigger,
    strikeTrigger: trigger,
    textAlignTrigger: trigger,
    underlineTrigger: trigger,
    undoTrigger: trigger,
    charactersCount:
      'pointer-events-none absolute right-2 bottom-2 mr-1 ml-auto text-gray-400 text-xs',
  }),
});
