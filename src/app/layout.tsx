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
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  description: siteConfig.description,
  keywords: [
    "Antifocus",
    "Antifocus Custom",
    "Vendor Merchandise Souvenir Custom",
    "Merchandise Souvenir Indonesia",
    "Custom Merchandise Souvenir",
  ],
  openGraph: {
    type: "website",
    locale: "id-ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.author.name}`,
  },
  creator: siteConfig.author.name,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
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
