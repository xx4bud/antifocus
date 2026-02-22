"use client";

import { IconHeart, IconHome, IconSearch, IconUser } from "@tabler/icons-react";
import { NavLink } from "~/components/ui/nav-link";
import { usePathname } from "~/i18n/navigation";
import { cn } from "~/utils/styles";
import type { NavItem } from "~/utils/types";

interface BottomTabsProps {
  className?: string;
}

const tabItems: NavItem[] = [
  { icon: IconHome, label: "Beranda", href: "/" },
  { icon: IconSearch, label: "Cari", href: "/search" },
  { icon: IconHeart, label: "Pesanan", href: "/order" },
  { icon: IconUser, label: "Akun", href: "/account" },
];

export function BottomTabs({ className }: BottomTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed right-0 bottom-0 left-0 z-50 border-gray-200 border-t bg-white shadow-lg",
        className
      )}
    >
      <div className="mx-auto flex h-16 basis-1/4 items-center justify-around">
        {tabItems.map((tab) => {
          const href = tab.href;
          const isActive = pathname === href;

          return (
            <NavLink
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              className={cn(
                "flex flex-1 flex-col items-center justify-center transition-colors duration-200 focus:outline-none",
                isActive ? "text-primary" : "text-gray-400 hover:text-primary"
              )}
              href={tab.href ?? "/"}
              key={tab.label}
              type="button"
            >
              {tab.icon && <tab.icon className="size-4" />}
              <span className="font-medium text-xs">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
