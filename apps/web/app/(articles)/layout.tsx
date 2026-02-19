import {Suspense, type PropsWithChildren} from 'react';
import {Hero} from './hero';
import {Menu} from './Menu';
import {Tags} from './Tags';

export default async function Layout({children}: PropsWithChildren) {
  return (
    <div>
      <Hero />

      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-4 py-6 lg:flex-row">
        <section className="order-1 grow lg:order-0">
          <Menu />
          <Suspense>{children}</Suspense>
        </section>
        <section className="order-0 w-full shrink-0 rounded bg-gray-100 p-4 lg:order-1 lg:w-64">
          <h2 className="tracking-wide">Popular Tags</h2>
          <Tags />
        </section>
      </div>
    </div>
  );
}
