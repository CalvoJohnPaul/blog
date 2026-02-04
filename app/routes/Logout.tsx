import {redirect} from 'react-router';
import {commitSession, getSession} from '~/utils/session';
import type {Route} from './+types/Logout';

export async function action({request}: Route.ActionArgs) {
  if (request.method.toUpperCase() === 'DELETE') {
    const session = await getSession(request.headers.get('Cookie'));
    session.unset('user');
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  return new Response('Not found', {status: 404});
}
