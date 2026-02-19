import type {PropsWithChildren} from 'react';
import {Menu} from './Menu';
import {Profile} from './Profile';

export default function Layout({children}: PropsWithChildren) {
  return (
    <div>
      <Profile />
      <section className="mx-auto mt-10 max-w-3xl px-4">
        <Menu />
        {children}
      </section>
    </div>
  );
}
