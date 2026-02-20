import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getCurrentUser} from '../services/Session';
import {SettingsForm} from './SettingsForm';
import {SignOut} from './SignOut';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  const user = await getCurrentUser();

  if (user == null) return notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-center text-4xl">Your Settings</h1>
      <SettingsForm />
      <div className="mt-5 border-t border-gray-200 pt-5">
        <SignOut />
      </div>
    </div>
  );
}
