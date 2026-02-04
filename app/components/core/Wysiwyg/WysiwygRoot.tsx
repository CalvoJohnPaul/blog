import type {Assign, HTMLArkProps} from '@ark-ui/react';
import {ark} from '@ark-ui/react/factory';
import {mergeProps} from '@ark-ui/react/utils';
import {forwardRef, useMemo} from 'react';
import {splitProps} from '~/utils/splitProps';
import {useWysiwyg, type UseWysiwygProps} from './useWysiwyg';
import {WysiwygProvider} from './useWysiwygContext';

export interface WysiwygProps extends Assign<HTMLArkProps<'div'>, UseWysiwygProps> {}

export const Root = forwardRef<HTMLDivElement, WysiwygProps>((props, ref) => {
	const [useWysiwygProps, localProps] = useMemo(
		() =>
			splitProps(
				props,
				'defaultValue',
				'disabled',
				'id',
				'ids',
				'invalid',
				'name',
				'onValueChange',
				'placeholder',
				'readOnly',
				'required',
				'spellCheck',
				'value',
				'limit',
			),
		[props],
	);

	const wysiwyg = useWysiwyg(useWysiwygProps);

	const mergedProps = useMemo(
		() => mergeProps(wysiwyg.getRootProps(), localProps),
		[localProps, wysiwyg],
	);

	return (
		<WysiwygProvider value={wysiwyg}>
			<ark.div ref={ref} {...mergedProps} />
		</WysiwygProvider>
	);
});

Root.displayName = 'WysiwygRoot';
