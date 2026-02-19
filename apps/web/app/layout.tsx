import clsx from 'clsx';
import type {Metadata} from 'next';
import {Source_Sans_3, Titillium_Web} from 'next/font/google';
import {Suspense, type PropsWithChildren} from 'react';
import './globals.css';
import {Navbar} from './Navbar';
import {Providers} from './Providers';

const body = Source_Sans_3({
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  subsets: ['latin'],
  preload: true,
  variable: '--font-body',
});

const heading = Titillium_Web({
  weight: ['700', '900'],
  display: 'swap',
  subsets: ['latin'],
  preload: true,
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Blog',
    default: 'Blog',
  },
};

export default async function Layout({children}: PropsWithChildren) {
  return (
    <html lang="en" className={clsx(body.variable, heading.variable, 'scheme-light')}>
      <body className="min-h-dvh bg-white font-body text-gray-800">
        <Suspense>
          <Providers>
            <Navbar />
            <main>{children}</main>
            <div className="h-16" />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
