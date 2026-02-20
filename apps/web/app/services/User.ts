import {hash} from 'bcrypt';
import {isEmpty} from 'es-toolkit/compat';
import {cache} from 'react';
import type {UserWhereInput} from '~/.generated/prisma/models';
import {prisma} from '~/config/prisma';
import type {CreateUserInput, UpdateUserDataInput, User} from '~/definitions/user';

export const findUser = cache(async (id: number): Promise<User | null> => {
  return await prisma.user
    .findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        bio: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        followers: {select: {followingId: true}},
        following: {select: {followerId: true}},
      },
    })
    .then((v) =>
      v == null
        ? null
        : {
            ...v,
            followers: v.following.map((f) => f.followerId),
            following: v.followers.map((f) => f.followingId),
          },
    );
});

export async function createUser(data: CreateUserInput): Promise<User> {
  return await prisma.user
    .create({
      data: {
        ...data,
        password: await hash(data.password, 8),
      },
      select: {
        id: true,
        bio: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    .then((v) => ({
      ...v,
      following: [],
      followers: [],
    }));
}

export async function updateUser(id: number, data: UpdateUserDataInput): Promise<User> {
  return await prisma.user
    .update({
      where: {id},
      data: {
        ...data,
        password: data.password ? await hash(data.password, 8) : undefined,
      },
      select: {
        id: true,
        bio: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        followers: {select: {followingId: true}},
        following: {select: {followerId: true}},
      },
    })
    .then((v) => ({
      ...v,
      followers: v.following.map((f) => f.followerId),
      following: v.followers.map((f) => f.followingId),
    }));
}

export const userExists = cache(async (where: UserWhereInput): Promise<boolean> => {
  if (isEmpty(where)) return false;
  const count = await prisma.user.count({where});
  return count > 0;
});
