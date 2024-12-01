import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | antifocus',
    default: 'antifocus',
  },
  description: 'welcome to antifocus',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={openSans.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
