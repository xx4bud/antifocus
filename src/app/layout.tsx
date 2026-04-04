import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { cn } from "@/lib/utils/cn";
import { geistMono, geistSans, robotoSerif } from "@/styles/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={cn(
        "h-full bg-background font-sans antialiased",
        geistSans.variable,
        geistMono.variable,
        robotoSerif.variable
      )}
      lang="id-ID"
      suppressHydrationWarning
    >
      <body className="flex min-h-svh flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export function generateMetadata(): Metadata {
  return {
    title: "Antifocus",
  };
}
