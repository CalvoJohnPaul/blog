import {useMutation} from '@tanstack/react-query';
import {CommentDefinition, type CreateCommentInput} from '~/definitions/comment';
import {HttpResponseDefinition} from '~/definitions/common';

export function useCreateCommentMutation() {
  return useMutation({
    mutationKey: ['createComment'],
    mutationFn: async (data: CreateCommentInput) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const obj = HttpResponseDefinition(CommentDefinition).parse(await res.json());

      if (!obj.ok) {
        const err = new Error();
        err.name = obj.error.name;
        err.message = obj.error.message;
        throw err;
      }

      return obj.data;
    },
  });
}
