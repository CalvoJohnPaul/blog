import {prisma} from '~/config/prisma';
import type {Follow} from '~/definitions/Follow';

export async function getFollows(userId: number): Promise<Follow> {
  const [followers, following] = await prisma.$transaction([
    prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
  ]);

  return {
    followers: followers.map((f) => f.follower),
    following: following.map((f) => f.following),
  };
}

export interface FollowInput {
  followerId: number;
  followingId: number;
}

export async function follow(data: FollowInput): Promise<void> {
  await prisma.follow.create({data});
}

export interface UnfollowInput {
  followerId: number;
  followingId: number;
}

export async function unfollow(data: UnfollowInput): Promise<void> {
  await prisma.follow.delete({where: {followerId_followingId: data}});
}
