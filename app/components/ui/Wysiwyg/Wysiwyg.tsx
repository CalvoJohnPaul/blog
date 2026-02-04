import {Wysiwyg} from '~/components/core/Wysiwyg';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {wysiwygRecipe} from './Wysiwyg.recipe';

const {withContext, withProvider} = createRecipeContext(wysiwygRecipe);

export const Root = withProvider(Wysiwyg.Root, 'root');
export const BlockquoteTrigger = withContext(Wysiwyg.BlockquoteTrigger, 'blockquoteTrigger');
export const BoldTrigger = withContext(Wysiwyg.BoldTrigger, 'boldTrigger');
export const BubbleMenu = withContext(Wysiwyg.BubbleMenu, 'bubbleMenu');
export const BulletListTrigger = withContext(Wysiwyg.BulletListTrigger, 'bulletListTrigger');
export const CodeBlockTrigger = withContext(Wysiwyg.CodeBlockTrigger, 'codeBlockTrigger');
export const Content = withContext(Wysiwyg.Content, 'content');
export const Control = withContext(Wysiwyg.Control, 'control');
export const FloatingMenu = withContext(Wysiwyg.FloatingMenu, 'floatingMenu');
export const HardBreakTrigger = withContext(Wysiwyg.HardBreakTrigger, 'hardBreakTrigger');
export const HeadingTrigger = withContext(Wysiwyg.HeadingTrigger, 'headingTrigger');
export const ImageHiddenInput = Wysiwyg.ImageHiddenInput;
export const ImageTrigger = withContext(Wysiwyg.ImageTrigger, 'imageTrigger');
export const ItalicTrigger = withContext(Wysiwyg.ItalicTrigger, 'italicTrigger');
export const LinkTrigger = withContext(Wysiwyg.LinkTrigger, 'linkTrigger');
export const OrderedListTrigger = withContext(Wysiwyg.OrderedListTrigger, 'orderedListTrigger');
export const RedoTrigger = withContext(Wysiwyg.RedoTrigger, 'redoTrigger');
export const StrikeTrigger = withContext(Wysiwyg.StrikeTrigger, 'strikeTrigger');
export const TextAlignTrigger = withContext(Wysiwyg.TextAlignTrigger, 'textAlignTrigger');
export const UnderlineTrigger = withContext(Wysiwyg.UnderlineTrigger, 'underlineTrigger');
export const UndoTrigger = withContext(Wysiwyg.UndoTrigger, 'undoTrigger');
export const CharactersCount = withContext(Wysiwyg.CharactersCount, 'charactersCount');
export const Context = Wysiwyg.Context;
