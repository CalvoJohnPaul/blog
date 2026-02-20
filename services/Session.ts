import {compare} from 'bcrypt';
import {addDays} from 'date-fns/addDays';
import {cookies} from 'next/headers';
import {cache} from 'react';
import {prisma} from '~/config/prisma';
import {IdDefinition} from '~/definitions/common';
import type {CreateSessionInput} from '~/definitions/session';
import type {User} from '~/definitions/user';
import {findUser} from './User';

export async function createSession(input: CreateSessionInput) {
  const user = await prisma.user.findUnique({
    where: {email: input.email},
    select: {
      id: true,
      password: true,
    },
  });

  if (user == null) return false;

  const matches = await compare(input.password, user.password);

  if (!matches) return false;

  const store = await cookies();

  store.set('user', user.id.toString(), {
    httpOnly: true,
    sameSite: 'strict',
    expires: addDays(new Date(), 7),
  });

  return true;
}

export async function destroySession() {
  const store = await cookies();
  store.delete('user');
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const store = await cookies();
  const userId = IdDefinition.optional().nullable().catch(null).parse(store.get('user')?.value);
  if (!userId) return null;
  const user = await findUser(userId);
  return user;
});
