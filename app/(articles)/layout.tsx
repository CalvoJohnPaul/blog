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
        <Tags />
      </div>
    </div>
  );
}
