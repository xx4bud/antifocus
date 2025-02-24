import { getSession } from "@/actions/user";
import { AppHeader } from "@/components/app-header";
import React from "react";
import NotFound from "../not-found";
import { AdminBreadcrumb } from "@/components/admin-breadcrumb";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const admin = session?.user?.role === "ADMIN";

  if (!admin) {
    return <NotFound />;
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <AppHeader />
      <div className="container flex min-h-svh flex-1 flex-col gap-3 p-3">
        <AdminBreadcrumb />
        <div className="flex flex-1 flex-col gap-6 md:flex-row">
          <AdminSidebar className="hidden flex-shrink-0 sm:w-[200px] md:block" />
          <div className="flex w-full flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
