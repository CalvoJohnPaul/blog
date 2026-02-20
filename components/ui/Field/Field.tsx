'use client';

import {Field} from '@ark-ui/react/field';
import {createRecipeContext} from '~/utils/createRecipeContext';
import {fieldRecipe} from './Field.recipe';

const {withProvider, withContext} = createRecipeContext(fieldRecipe);

export const Root = withProvider(Field.Root, 'root');
export const ErrorText = withContext(Field.ErrorText, 'errorText');
export const HelperText = withContext(Field.HelperText, 'helperText');
export const Input = withContext(Field.Input, 'input');
export const Label = withContext(Field.Label, 'label');
export const RequiredIndicator = withContext(Field.RequiredIndicator, 'requiredIndicator');
export const Select = withContext(Field.Select, 'select');
export const Textarea = withContext(Field.Textarea, 'textarea');
export const Context = Field.Context;
