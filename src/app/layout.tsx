import { fontMono, fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | " + siteConfig.name,
    default: siteConfig.name,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "antifocus",
    "antifocus custom",
    "vendor custom",
    "vendor merchandise souvenir custom",
    "custom merchandise souvenir",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-svh bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
