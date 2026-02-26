"use client";

import {
  IconBuildingStore,
  IconCategory,
  IconDashboard,
  IconKey,
  IconLink,
  IconPackage,
  IconPhoto,
  IconReceipt,
  IconShieldCheck,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { Link, usePathname } from "~/i18n/navigation";
import type { User } from "~/lib/db/types";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin" as const, icon: IconDashboard },
    ],
  },
  {
    label: "Auth",
    items: [
      { label: "Users", href: "/admin/users" as const, icon: IconUsers },
      {
        label: "Sessions",
        href: "/admin/sessions" as const,
        icon: IconShieldCheck,
      },
      { label: "Accounts", href: "/admin/accounts" as const, icon: IconLink },
      {
        label: "Verifications",
        href: "/admin/verifications" as const,
        icon: IconKey,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products" as const,
        icon: IconPackage,
      },
      {
        label: "Categories",
        href: "/admin/categories" as const,
        icon: IconCategory,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders" as const, icon: IconReceipt },
      {
        label: "Customers",
        href: "/admin/customers" as const,
        icon: IconUsersGroup,
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners" as const, icon: IconPhoto },
    ],
  },
  {
    label: "Tenants",
    items: [
      {
        label: "Organizations",
        href: "/admin/organizations" as const,
        icon: IconBuildingStore,
      },
    ],
  },
];

interface AdminSidebarProps {
  user: User;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-sm">
                    Admin Panel
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    Antifocus
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/account">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage alt={user.name} src={user.image ?? undefined} />
                  <AvatarFallback className="rounded-lg">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-sm">
                    {user.name}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {user.email}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
