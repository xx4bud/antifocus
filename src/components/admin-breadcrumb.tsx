"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  name: string;
  href: string;
}

function generateBreadcrumbs(
  pathname: string
): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let currentPath = "";
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const name =
      path.charAt(0).toUpperCase() +
      path.slice(1).replace(/-/g, " ");
    items.push({
      name,
      href: currentPath,
    });
  });
  return items;
}

interface AdminBreadcrumbProps {
  className?: string;
}

export function AdminBreadcrumb({
  className,
}: AdminBreadcrumbProps) {
  const pathname = usePathname();
  const items = generateBreadcrumbs(pathname);

  if (!pathname.startsWith("/admin")) return null;

  return (
    <nav
      className={cn(
        "flex items-center text-sm text-muted-foreground",
        className
      )}
    >
      <Link
        href="/"
        className="transition-colors hover:text-foreground"
      >
        Home
      </Link>
      <ChevronRight className="mx-1 size-4" />
      <Link
        href="/admin"
        className={cn(
          "transition-colors hover:text-foreground",
          pathname === "/admin"
            ? "font-medium text-foreground"
            : ""
        )}
      >
        Admin
      </Link>
      {items.slice(1).map((item) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="mx-1 size-4" />
          <Link
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === item.href
                ? "line-clamp-1 max-w-[70px] transition-colors hover:text-foreground md:max-w-none"
                : ""
            )}
          >
            {item.name}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
