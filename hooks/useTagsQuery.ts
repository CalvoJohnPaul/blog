import {type QueryKey, type UndefinedInitialDataOptions, useQuery} from '@tanstack/react-query';
import * as z from 'zod';
import {HttpResponseDefinition} from '~/definitions/common';

const getQueryKey = (): QueryKey => ['tags'];
const getQueryFn = () => {
  return async () => {
    const res = await fetch('/api/tags', {
      headers: {
        Accept: 'application/json',
      },
    });

    const obj = HttpResponseDefinition(z.array(z.string())).parse(await res.json());

    if (!obj.ok) {
      const err = new Error();
      err.name = obj.error.name;
      err.message = obj.error.message;
      throw err;
    }

    return obj.data;
  };
};

export function useTagsQuery(
  options?: Pick<
    UndefinedInitialDataOptions<string[]>,
    | 'enabled'
    | 'gcTime'
    | 'staleTime'
    | 'initialData'
    | 'refetchInterval'
    | 'refetchIntervalInBackground'
    | 'refetchOnMount'
    | 'refetchOnReconnect'
    | 'refetchOnWindowFocus'
    | 'placeholderData'
    | 'retry'
    | 'retryDelay'
    | 'retryOnMount'
  >,
) {
  return useQuery({
    queryKey: getQueryKey(),
    queryFn: getQueryFn(),
    ...options,
  });
}

useTagsQuery.getQueryKey = getQueryKey;
useTagsQuery.getQueryFn = getQueryFn;
