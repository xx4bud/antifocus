import { AppFooter } from "@/components/app-footer";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/queries";
import { notFound } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return notFound();
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={user} badge={true} />
      <SidebarInset>
        <div className="border-grid flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex flex-1 flex-grow flex-col px-4">
            {children}
          </main>
          <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
