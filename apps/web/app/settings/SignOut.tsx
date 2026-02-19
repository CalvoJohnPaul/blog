'use client';

import {useRouter} from 'next/navigation';
import {toaster} from '~/config/toaster';
import {useDestroySessionMutation} from '~/hooks/useDestroySessionMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {getQueryClient} from '~/utils/getQueryClient';

export function SignOut() {
  const queryClient = getQueryClient();

  const router = useRouter();
  const mutation = useDestroySessionMutation();

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await mutation.mutateAsync();
          queryClient.setQueryData(useMeQuery.getQueryKey(), null);
          queryClient.invalidateQueries({
            exact: false,
            queryKey: usePostsQuery.getQueryKey(),
            refetchType: 'active',
          });
          router.push('/');
        } catch {
          toaster.error({
            description: 'Failed to sign out. Please try again.',
          });
        }
      }}
      disabled={mutation.isPending}
      className="rounded border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
    >
      Or click here to logout.
    </button>
  );
}
