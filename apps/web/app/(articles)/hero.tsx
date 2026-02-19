'use client';

import {useMeQuery} from '~/hooks/useMeQuery';

export function Hero() {
  const meQuery = useMeQuery();

  if (meQuery.data == null) {
    return (
      <div className="flex flex-col items-center bg-emerald-500 px-4 py-10 text-white">
        <h1 className="font-heading text-5xl leading-none drop-shadow-md">conduit</h1>
        <p className="mt-3 text-2xl leading-none font-light">A place to share your knowledge</p>
      </div>
    );
  }
}
