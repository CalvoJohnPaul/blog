import {useMutation} from '@tanstack/react-query';
import {VoidHttpResponseDefinition} from '~/definitions/common';

export function useDeleteCommentMutation() {
  return useMutation({
    mutationKey: ['deleteComment'],
    mutationFn: async (id: string | number) => {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      const obj = VoidHttpResponseDefinition.parse(await res.json());

      if (!obj.ok) {
        const err = new Error();
        err.name = obj.error.name;
        err.message = obj.error.message;
        throw err;
      }
    },
  });
}
