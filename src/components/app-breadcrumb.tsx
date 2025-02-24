"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AppBreadcrumbItem {
  name: string;
  href: string;
}

interface AppBreadcrumbProps {
  items: Array<AppBreadcrumbItem>;
  className?: string;
}

export function AppBreadcrumb({
  items,
  className,
}: AppBreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex items-center text-sm text-muted-foreground",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 size-4" />
          )}
          <div>
            {index === items.length - 1 ? (
              <span
                className="line-clamp-1 max-w-[70px] font-medium text-foreground md:max-w-none"
                title={item.name}
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="line-clamp-1 max-w-[70px] transition-colors hover:text-foreground md:max-w-none"
                title={item.name}
              >
                {item.name}
              </Link>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
