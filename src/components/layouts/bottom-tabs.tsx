"use client";

import { IconHeart, IconHome, IconSearch, IconUser } from "@tabler/icons-react";
import { Link } from "@/lib/i18n/link";
import { usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/lib/utils/types";

interface BottomTabsProps {
  className?: string;
}

const tabItems: NavItem[] = [
  { icon: IconHome, label: "Beranda", href: "/" },
  { icon: IconSearch, label: "Cari", href: "/search" },
  { icon: IconHeart, label: "Pesanan", href: "/orders" },
  { icon: IconUser, label: "Akun", href: "/account" },
];

export function BottomTabs({ className }: BottomTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed right-0 bottom-0 left-0 z-10 border-t bg-background shadow-lg",
        className
      )}
    >
      <div className="mx-auto flex h-16 basis-1/4 items-center justify-around">
        {tabItems.map((tab) => {
          const href = tab.href;
          const isActive = pathname === href;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              aria-label={tab.label}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-200 focus:outline-none",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
              href={tab.href ?? "#"}
              key={tab.label}
            >
              {tab.icon && <tab.icon className="size-4" />}
              <span className="font-medium text-xs">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
