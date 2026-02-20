import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getCurrentUser} from '../services/Session';
import {EditorForm} from './EditorForm';

export const metadata: Metadata = {
  title: 'Editor',
};

export default async function Page() {
  const user = await getCurrentUser();

  if (user == null) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <EditorForm />
    </div>
  );
}
