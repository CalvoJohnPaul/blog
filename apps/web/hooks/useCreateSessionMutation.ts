import {useMutation} from '@tanstack/react-query';
import {VoidHttpResponseDefinition} from '~/definitions/common';
import type {CreateSessionInput} from '~/definitions/session';

export function useCreateSessionMutation() {
  return useMutation({
    mutationKey: ['createSession'],
    mutationFn: async (data: CreateSessionInput) => {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
