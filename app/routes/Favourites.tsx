import * as z from 'zod';
import {prisma} from '~/config/prisma';
import {getSession} from '~/utils/session';
import type {Route} from './+types/Favourites';

export async function action({request}: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const data = await request.formData();
  const userId = session.get('user');
  const postId = z
    .string()
    .transform((v) => {
      const n = parseInt(v);
      return Number.isNaN(n) ? null : n;
    })
    .safeParse(data.get('id')).data;

  if (postId == null) return new Response('Bad request', {status: 400});
  if (userId == null) return new Response('Bad request', {status: 400});

  if (request.method.toUpperCase() !== 'POST') return new Response('Not found', {status: 404});

  const exists = await prisma.favourite.exists({
    postId,
    userId,
  });

  if (exists) {
    await prisma.favourite.deleteMany({
      where: {
        postId,
        userId,
      },
    });
  } else {
    await prisma.favourite.create({
      data: {
        postId,
        userId,
      },
      select: {
        id: true,
      },
    });
  }
}
