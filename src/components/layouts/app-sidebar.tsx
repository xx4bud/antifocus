import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavGroups } from "@/components/layouts/nav-main";
import { NavUser } from "@/components/layouts/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAuthSession } from "@/features/auth/lib/services";
import { Link } from "@/lib/i18n/navigation";
import { ALL_GROUPS } from "./nav-data";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const sessionResult = await getAuthSession();

  const user =
    sessionResult.ok && sessionResult.value?.user
      ? {
          name: sessionResult.value.user.name || "User",
          email: sessionResult.value.user.email || "",
          avatar: sessionResult.value.user.image || "",
        }
      : {
          name: "Guest",
          email: "guest@antifocus.local",
          avatar: "",
        };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin">
                <IconInnerShadowTop className="size-5!" />
                <span className="font-semibold text-base">Antifocus</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* ── All ERP Groups ────────────────────────────────── */}
        <NavGroups groups={ALL_GROUPS} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
