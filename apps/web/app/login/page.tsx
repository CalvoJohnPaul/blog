import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getCurrentUser} from '../services/Session';
import {LoginForm} from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default async function Page() {
  const user = await getCurrentUser();

  if (user != null) return redirect('/');

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl">Sign In</h1>
        <Link href="/register" className="text-emerald-500">
          Need an account?
        </Link>
      </div>
      <div className="mt-3">
        <LoginForm />
      </div>
    </div>
  );
}
