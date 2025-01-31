import { AppFooter } from "@/components/shared/footer";
import { DashboardHeader } from "@/components/shared/header/dashboard";
import { AppSidebar } from "@/components/shared/sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/utils";
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
      <AppSidebar dashboard={true} user={user} />
      <SidebarInset>
        <div className="border-grid flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex flex-1 flex-grow flex-col">
            {children}
          </main>
          <AppFooter />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
