import {type QueryKey, type UndefinedInitialDataOptions, useQuery} from '@tanstack/react-query';
import {HttpResponseDefinition} from '~/definitions/common';
import {type User, UserDefinition} from '~/definitions/user';

const getQueryKey = (id: string | number): QueryKey => ['user', id];
const getQueryFn = (id: string | number) => {
  return async () => {
    const res = await fetch(`/api/users/${id}`, {
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    const obj = HttpResponseDefinition(UserDefinition).parse(await res.json());

    if (!obj.ok) {
      const err = new Error();
      err.name = obj.error.name;
      err.message = obj.error.message;
      throw err;
    }

    return obj.data;
  };
};

export function useUserQuery(
  id: string | number,
  options?: Pick<
    UndefinedInitialDataOptions<User>,
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
    queryKey: getQueryKey(id),
    queryFn: getQueryFn(id),
    ...options,
  });
}

useUserQuery.getQueryKey = getQueryKey;
useUserQuery.getQueryFn = getQueryFn;
