import {type QueryKey, type UndefinedInitialDataOptions, useQuery} from '@tanstack/react-query';
import {isBoolean, isDate, isNil, isNumber, isString} from 'es-toolkit';
import {isArray} from 'es-toolkit/compat';
import {HttpResponseDefinition, type Paginated, PaginatedDefinition} from '~/definitions/common';
import {type Post, PostDefinition, type PostsInput} from '~/definitions/post';

const getQueryKey = (input?: PostsInput): QueryKey => ['posts', input].filter((v) => !isNil(v));

const serialize = (input?: PostsInput) => {
  if (!input) return '';

  const q = new URLSearchParams();
  const e = Object.entries(input);
  const f = (v: string | number | boolean | Date | null | undefined) => {
    if (isString(v)) return v;
    if (isNumber(v)) return v.toString();
    if (isBoolean(v)) return v === true ? 'true' : 'false';
    if (isDate(v)) return v.toISOString();
    return v;
  };

  for (const [k, v] of e) {
    if (isArray(v)) {
      v.forEach((i) => {
        const s = f(i);
        if (isNil(s)) return;
        q.append(k, s);
      });
    } else {
      const s = f(v);
      if (isNil(s)) continue;
      q.append(k, s);
    }
  }

  return q.toString();
};

const getQueryFn = (input?: PostsInput) => async () => {
  const res = await fetch(`/api/posts?${serialize(input)}`, {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  const obj = HttpResponseDefinition(PaginatedDefinition(PostDefinition)).parse(await res.json());

  if (!obj.ok) {
    const err = new Error();
    err.name = obj.error.name;
    err.message = obj.error.message;
    throw err;
  }

  return obj.data;
};

export function usePostsQuery(
  input?: PostsInput,
  options?: Pick<
    UndefinedInitialDataOptions<Paginated<Post>>,
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
    queryKey: getQueryKey(input),
    queryFn: getQueryFn(input),
    ...options,
  });
}

usePostsQuery.getQueryKey = getQueryKey;
usePostsQuery.getQueryFn = getQueryFn;
