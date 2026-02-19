import {isServer, QueryClient} from '@tanstack/react-query';
import {cache} from 'react';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 4 /* 4hr */,
        staleTime: 1000 * 60 * 60 /* 1hr */,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let BROWSER_QUERY_CLIENT: QueryClient | undefined;

export const getQueryClient = cache(() => {
  if (isServer) {
    return createQueryClient();
  }

  if (!BROWSER_QUERY_CLIENT) {
    BROWSER_QUERY_CLIENT = createQueryClient();
  }

  return BROWSER_QUERY_CLIENT;
});
