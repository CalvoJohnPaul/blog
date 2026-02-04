import * as z from 'zod';
import {prisma} from '~/config/prisma';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Following';

export async function action({request}: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const data = await request.formData();
  const followerId = session.get('user');
  const followingId = z
    .string()
    .transform((v) => {
      const n = parseInt(v);
      return Number.isNaN(n) ? null : n;
    })
    .safeParse(data.get('id')).data;

  if (followerId == null) return new Response('Bad request', {status: 400});
  if (followingId == null) return new Response('Bad request', {status: 400});

  if (request.method.toUpperCase() !== 'POST') return new Response('Not found', {status: 404});

  const exists = await prisma.follow.exists({
    followerId,
    followingId,
  });

  if (exists) {
    await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }
}
