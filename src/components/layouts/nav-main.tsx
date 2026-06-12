"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/lib/i18n/navigation";
import type { NavGroup, NavItem } from "./nav-data";

/**
 * Flat, minimalist ERP sidebar navigation
 * No trees, no icons, just data.
 */
export function NavGroups({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.domain}>
          <SidebarGroupLabel className="font-semibold text-[10px] text-sidebar-foreground/40 uppercase tracking-widest">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {/* Render all items in the group flatly */}
            {group.items?.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  size="sm"
                >
                  <Link href={item.url}>
                    <span>{item.title}</span>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {/* If there are sections, flatten them into the group */}
            {group.sections
              ?.flatMap((s) => s.items)
              .map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    size="sm"
                  >
                    <Link href={item.url}>
                      <span>{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

export function NavItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.url}
              size="sm"
            >
              <Link href={item.url}>
                <span>{item.title}</span>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
