import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import React from "react";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-1 flex-col">
      <AppHeader />
      <div className="container flex min-h-svh flex-1 flex-col">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
