import { cn } from "@/lib/utils/cn";
import { fontMono, fontSans, fontSerif } from "@/styles/fonts";
import "@/styles/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Antifocus",
    template: "%s | Antifocus",
  },
  description: "Enterprise Print-on-Demand E-Commerce & ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "h-full bg-background font-sans antialiased",
        fontSans.variable,
        fontMono.variable,
        fontSerif.variable
      )}
      lang="id"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
