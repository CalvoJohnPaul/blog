import {useMutation} from '@tanstack/react-query';
import {HttpResponseDefinition} from '~/definitions/common';
import {PostDefinition, type CreatePostInput} from '~/definitions/post';

export function useCreatePostMutation() {
  return useMutation({
    mutationKey: ['createPost'],
    mutationFn: async (data: CreatePostInput) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const obj = HttpResponseDefinition(PostDefinition).parse(await res.json());

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
