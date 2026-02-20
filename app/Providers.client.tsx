'use client';

import {Toaster} from '@ark-ui/react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {FrownIcon, SmileIcon} from 'lucide-react';
import type {PropsWithChildren} from 'react';
import {Toast} from '~/components/ui/Toast';
import {toaster} from '~/config/toaster';
import {getQueryClient} from '~/utils/getQueryClient';

export function Providers__client({children}: PropsWithChildren) {
  const client = getQueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Icon>{toast.type === 'error' ? <FrownIcon /> : <SmileIcon />}</Toast.Icon>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </Toaster>
    </>
  );
}
