import {TagsInput} from '@ark-ui/react';
import {XIcon} from 'lucide-react';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {tagsInputRecipe} from './TagsInput.recipe';

const {withContext, withProvider} = createRecipeContext(tagsInputRecipe);

export const Root = withProvider(TagsInput.Root, 'root');
export const ClearTrigger = withContext(TagsInput.ClearTrigger, 'clearTrigger');
export const Control = withContext(TagsInput.Control, 'control');
export const Input = withContext(TagsInput.Input, 'input');
export const Item = withContext(TagsInput.Item, 'item');
export const ItemDeleteTrigger = withContext(TagsInput.ItemDeleteTrigger, 'itemDeleteTrigger', {
  defaultProps: {
    children: <XIcon />,
  },
});
export const ItemInput = withContext(TagsInput.ItemInput, 'itemInput');
export const ItemPreview = withContext(TagsInput.ItemPreview, 'itemPreview');
export const ItemText = withContext(TagsInput.ItemText, 'itemText');
export const Label = withContext(TagsInput.Label, 'label');
export const Context = TagsInput.Context;
export const HiddenInput = TagsInput.HiddenInput;
export const ItemContext = TagsInput.ItemContext;
