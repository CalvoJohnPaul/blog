import {ark} from '@ark-ui/react';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {alertRecipe} from './Alert.recipe';

const {withProvider, withContext} = createRecipeContext(alertRecipe);

export const Root = withProvider(ark.div, 'root');
export const Icon = withContext(ark.svg, 'icon', {
  defaultProps: {
    asChild: true,
  },
});
export const Label = withContext(ark.div, 'label');
