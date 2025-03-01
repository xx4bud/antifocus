import { getSession } from "@/actions/user";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await getSession();
  
    if (session) {
      return redirect("/");
    }

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
