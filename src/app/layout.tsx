import "@/styles/globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { fontMono, fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { AppProvider } from "@/components/app-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | " + siteConfig.name,
    default:
      siteConfig.name +
      " | Vendor Merchandise Souvenir Custom",
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-svh bg-foreground font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
