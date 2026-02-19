import type {Metadata} from 'next';
import Link from 'next/link';
import {RegisterForm} from './RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl">Sign Up</h1>
        <Link href="/login" className="text-emerald-500">
          Have an account?
        </Link>
      </div>
      <div className="mt-3">
        <RegisterForm />
      </div>
    </div>
  );
}
