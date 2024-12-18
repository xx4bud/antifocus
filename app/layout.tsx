import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { getSession } from "@/lib/session";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | antifocus",
    default: "antifocus",
  },
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={openSans.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
