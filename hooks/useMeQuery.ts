import {type QueryKey, type UndefinedInitialDataOptions, useQuery} from '@tanstack/react-query';
import {HttpResponseDefinition} from '~/definitions/common';
import {type User, UserDefinition} from '~/definitions/user';

const getQueryKey = (): QueryKey => ['me'];
const getQueryFn = () => {
  return async () => {
    const res = await fetch('/api/me', {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    const obj = HttpResponseDefinition(UserDefinition.nullable()).parse(await res.json());

    if (!obj.ok) {
      const err = new Error();
      err.name = obj.error.name;
      err.message = obj.error.message;
      throw err;
    }

    return obj.data;
  };
};

export function useMeQuery(
  options?: Pick<
    UndefinedInitialDataOptions<User | null>,
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

useMeQuery.getQueryKey = getQueryKey;
useMeQuery.getQueryFn = getQueryFn;
