import {cache} from 'react';

export const dataAttr = cache((guard: boolean | undefined) => (guard ? '' : undefined));
