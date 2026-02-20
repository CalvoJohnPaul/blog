import {prisma} from '~/config/prisma';

interface FollowInput {
  followerId: number;
  followingId: number;
}

export async function follow(input: FollowInput): Promise<void> {
  await prisma.follow.upsert({
    where: {followerId_followingId: input},
    create: input,
    update: input,
  });
}

interface UnfollowInput {
  followerId: number;
  followingId: number;
}

export async function unfollow(input: UnfollowInput): Promise<void> {
  await prisma.follow.deleteMany({
    where: input,
  });
}
