import {type QueryKey, type UndefinedInitialDataOptions, useQuery} from '@tanstack/react-query';
import {isBoolean, isDate, isNil, isNumber, isString} from 'es-toolkit';
import {isArray} from 'es-toolkit/compat';
import {type Comment, CommentDefinition, type CommentsInput} from '~/definitions/comment';
import {HttpResponseDefinition, type Paginated, PaginatedDefinition} from '~/definitions/common';

const getQueryKey = (input?: CommentsInput): QueryKey =>
  ['comments', input].filter((v) => !isNil(v));

const serialize = (input?: CommentsInput) => {
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

const getQueryFn = (input?: CommentsInput) => async () => {
  const res = await fetch(`/api/comments?${serialize(input)}`, {
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  });

  const obj = HttpResponseDefinition(PaginatedDefinition(CommentDefinition)).parse(
    await res.json(),
  );

  if (!obj.ok) {
    const err = new Error();
    err.name = obj.error.name;
    err.message = obj.error.message;
    throw err;
  }

  return obj.data;
};

export function useCommentsQuery(
  input?: CommentsInput,
  options?: Pick<
    UndefinedInitialDataOptions<Paginated<Comment>>,
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

useCommentsQuery.getQueryKey = getQueryKey;
useCommentsQuery.getQueryFn = getQueryFn;
