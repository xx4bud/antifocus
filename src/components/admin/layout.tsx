import { AppHeader } from "@/components/app-header";
import { getSession } from "@/lib/queries";
import { notFound } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== "ADMIN") {
    return notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={user} />
      <div className="mx-auto flex h-screen w-full max-w-6xl flex-grow">
        {children}
      </div>
    </div>
  );
}
