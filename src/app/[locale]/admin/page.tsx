import type { Metadata } from "next";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SiteHeader } from "@/components/layouts/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getLocaleParams } from "@/lib/i18n/request";
import { constructMetadata } from "@/lib/utils/seo";
import { AdminClient } from "./client";

export default async function AdminPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AdminClient />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await getLocaleParams(params);

  return constructMetadata({
    title: "Admin Dashboard",
    description: "Coming soon...",
    locale,
    path: "/admin",
  });
}
