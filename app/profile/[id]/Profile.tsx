'use client';

import {useQueryClient} from '@tanstack/react-query';
import {RssIcon, SettingsIcon} from 'lucide-react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {Avatar} from '~/components/ui/Avatar';
import type {User} from '~/definitions/user';
import {useFollowMutation} from '~/hooks/useFollowMutation';
import {useMeQuery} from '~/hooks/useMeQuery';
import {usePostsQuery} from '~/hooks/usePostsQuery';
import {useUnfollowMutation} from '~/hooks/useUnfollowMutation';
import {useUserQuery} from '~/hooks/useUserQuery';
import {dataAttr} from '~/utils/dataAttr';

export function Profile() {
  const client = useQueryClient();
  const params = useParams<{id: string}>();
  const userId = Number(params.id);

  const meQuery = useMeQuery();
  const userQuery = useUserQuery(userId);
  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const ownProfile = userQuery.data?.id === meQuery.data?.id;
  const following = meQuery.data?.following.includes(userId);

  return (
    <section className="bg-gray-50 px-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-10">
        <Avatar.Root className="bg-emerald-100 size-24">
          {userQuery.data?.image && <Avatar.Image src={userQuery.data.image} />}
          <Avatar.Fallback className="icon:size-14 icon:text-emerald-500" />
        </Avatar.Root>

        <h2 className="mt-5 text-2xl leading-tight font-bold text-gray-600">
          {userQuery.data?.name}
        </h2>
        <p className="text-gray-500 leading-tight mb-2">{userQuery.data?.email}</p>

        {ownProfile ? (
          <Link
            href="/settings"
            className="flex mt-5 items-center gap-1 rounded border border-gray-200 px-3 py-2 bg-white text-gray-600"
          >
            <SettingsIcon className="size-4" />
            <span className="text-sm">Edit Profile Settings</span>
          </Link>
        ) : (
          <button
            type="button"
            className="flex mt-5 items-center gap-1 ui-selected:bg-emerald-400 ui-selected:border-emerald-400 ui-selected:text-white rounded border border-gray-200 px-3 py-2 bg-white text-gray-600"
            onClick={async () => {
              if (following) {
                await unfollowMutation.mutateAsync(params.id);

                client.invalidateQueries({
                  queryKey: usePostsQuery.getQueryKey(),
                  exact: false,
                  type: 'all',
                  refetchType: 'active',
                });

                client.setQueryData<User>(useMeQuery.getQueryKey(), (prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    following: prev.following.filter((id) => id !== userId),
                  };
                });
              } else {
                await followMutation.mutateAsync(params.id);

                client.invalidateQueries({
                  queryKey: usePostsQuery.getQueryKey(),
                  exact: false,
                  type: 'all',
                  refetchType: 'active',
                });

                client.setQueryData<User>(useMeQuery.getQueryKey(), (prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    following: [...prev.following, userId],
                  };
                });
              }
            }}
            disabled={followMutation.isPending || unfollowMutation.isPending}
            data-selected={dataAttr(following)}
          >
            <RssIcon className="size-4" />
            <span className="text-sm">{following ? 'Unfollow' : 'Follow'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
