import {useMutation} from '@tanstack/react-query';
import {VoidHttpResponseDefinition} from '~/definitions/common';

export function useDestroySessionMutation() {
  return useMutation({
    mutationKey: ['signOut'],
    mutationFn: async () => {
      const res = await fetch('/api/sessions', {
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
