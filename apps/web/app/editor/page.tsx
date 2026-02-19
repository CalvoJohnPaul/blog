import type {Metadata} from 'next';
import {EditorForm} from './EditorForm';

export const metadata: Metadata = {
  title: 'Editor',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <EditorForm />
    </div>
  );
}
