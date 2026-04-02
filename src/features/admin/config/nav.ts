import {
  type Icon,
  IconHierarchy,
  IconLayoutDashboard,
  IconSettings,
  IconShoppingBag,
  IconUsers,
} from "@tabler/icons-react";
import type { Route } from "@/lib/i18n/routing";

export interface NavItem {
  badge?: string;
  icon: Icon;
  title: string;
  url: Route;
}

export const adminNavItems: NavItem[] = [
  {
    title: "admin.nav.dashboard",
    url: "/admin",
    icon: IconLayoutDashboard,
  },
  {
    title: "admin.nav.users",
    url: "/admin/users",
    icon: IconUsers,
    badge: "new",
  },
  {
    title: "admin.nav.organizations",
    url: "/admin/organizations",
    icon: IconHierarchy,
  },
  {
    title: "admin.nav.orders",
    url: "/admin", // Orders route - will be updated
    icon: IconShoppingBag,
  },
  {
    title: "admin.nav.settings",
    url: "/admin/settings",
    icon: IconSettings,
  },
] as const;
