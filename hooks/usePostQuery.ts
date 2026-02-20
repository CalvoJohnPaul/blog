import {type QueryKey, type UndefinedInitialDataOptions, useQuery} from '@tanstack/react-query';
import {HttpResponseDefinition} from '~/definitions/common';
import {type Post, PostDefinition} from '~/definitions/post';

const getQueryKey = (id: string | number): QueryKey => ['post', id];
const getQueryFn = (id: string | number) => {
  return async () => {
    const res = await fetch(`/api/posts/${id}`, {
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });

    const obj = HttpResponseDefinition(PostDefinition).parse(await res.json());

    if (!obj.ok) {
      const err = new Error();
      err.name = obj.error.name;
      err.message = obj.error.message;
      throw err;
    }

    return obj.data;
  };
};

export function usePostQuery(
  id: string | number,
  options?: Pick<
    UndefinedInitialDataOptions<Post>,
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

usePostQuery.getQueryKey = getQueryKey;
usePostQuery.getQueryFn = getQueryFn;
