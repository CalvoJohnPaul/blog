'use client';

interface Props {
  error: Error & {digest?: string};
  reset(): void;
}

export default function Page(_: Props) {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <h1 className="font-bold font-heading text-7xl lg:text-8xl text-gray-200/75">500</h1>
    </main>
  );
}
