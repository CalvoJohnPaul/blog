import {useMutation} from '@tanstack/react-query';
import {VoidHttpResponseDefinition} from '~/definitions/common';

export function useRemovePostFromFavouritesMutation() {
  return useMutation({
    mutationKey: ['removePostFromFavourites'],
    mutationFn: async (id: string | number) => {
      const res = await fetch(`/api/posts/${id}/favourites`, {
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
