import {useMutation} from '@tanstack/react-query';
import {HttpResponseDefinition} from '~/definitions/common';
import {type UpdateUserDataInput, UserDefinition} from '~/definitions/user';

export function useUpdateMeMutation() {
  return useMutation({
    mutationKey: ['updateMe'],
    mutationFn: async (data: UpdateUserDataInput) => {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
    },
  });
}
