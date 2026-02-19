import clsx from 'clsx';
import type {Metadata} from 'next';
import {Source_Sans_3, Titillium_Web} from 'next/font/google';
import type {PropsWithChildren} from 'react';
import './globals.css';

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

export default function Layout({children}: PropsWithChildren) {
  return (
    <html lang="en" className={clsx(body.variable, heading.variable, 'scheme-light')}>
      <body className="min-h-dvh bg-white font-body text-gray-800">{children}</body>
    </html>
  );
}
