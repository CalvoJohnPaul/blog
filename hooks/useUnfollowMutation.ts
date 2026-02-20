import {useMutation} from '@tanstack/react-query';
import {VoidHttpResponseDefinition} from '~/definitions/common';

export function useUnfollowMutation() {
  return useMutation({
    mutationKey: ['unfollow'],
    mutationFn: async (id: string | number) => {
      const res = await fetch(`/api/users/${id}/follows`, {
        method: 'DELETE',
        credentials: 'include',
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
