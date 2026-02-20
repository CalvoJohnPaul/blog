import {useMutation} from '@tanstack/react-query';
import {HttpResponseDefinition} from '~/definitions/common';
import {type CreateUserInput, UserDefinition} from '~/definitions/user';

export function useCreateUserMutation() {
  return useMutation({
    mutationKey: ['createUser'],
    mutationFn: async (data: CreateUserInput) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
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
