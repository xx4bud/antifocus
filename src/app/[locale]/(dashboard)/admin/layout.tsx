import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { AppSidebar } from "@/features/admin/components/app-sidebar";
import { auth } from "@/lib/auth/server";
import type { AuthSession } from "@/lib/auth/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  const session = sessionData as unknown as AuthSession | null;

  if (!session?.user) {
    redirect("/");
  }

  const role = session.user.role;
  if (role !== "admin" && role !== "super_admin") {
    redirect("/");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader session={session} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
