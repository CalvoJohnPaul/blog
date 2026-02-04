import {createCookieSessionStorage} from 'react-router';

export const {getSession, commitSession, destroySession} = createCookieSessionStorage<{
  user: number;
}>({
  cookie: {
    name: 'session',
    path: '/',
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax',
  },
});
