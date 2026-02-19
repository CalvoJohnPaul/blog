'use client';

import {Toast, Toaster} from '@ark-ui/react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import type {PropsWithChildren} from 'react';
import {toaster} from '~/config/toaster';
import {getQueryClient} from '~/utils/getQueryClient';

export function Providers__client({children}: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
          </Toast.Root>
        )}
      </Toaster>
    </>
  );
}
