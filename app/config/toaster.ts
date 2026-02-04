import {createToaster} from '@ark-ui/react';

export const toaster = createToaster({
	max: 5,
	overlap: true,
	duration: 5000,
	placement: 'bottom-end',
});
