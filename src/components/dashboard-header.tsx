"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { menuConfig } from "@/config/menu";

export function DashboardHeader() {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items: { title: string; url: string }[] = [];
    menuConfig.navAdmin.forEach((menu) => {
      if (pathname.startsWith(menu.items[0].url)) {
        items.push({ title: menu.title, url: menu.url });
        menu.items.forEach((subItem) => {
          if (pathname === subItem.url) {
            items.push({
              title: subItem.title,
              url: subItem.url,
            });
          }
        });
      }
    });
    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();
  const maxBreadcrumbs = 3;
  let displayedBreadcrumbs = breadcrumbItems;
  let showEllipsis = false;

  if (breadcrumbItems.length > maxBreadcrumbs) {
    displayedBreadcrumbs = breadcrumbItems.slice(-maxBreadcrumbs);
    showEllipsis = true;
  }

  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="container-wrapper">
        <div className=" flex h-16 flex-1 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear">
          <div className="flex flex-1 items-center">
            <SidebarTrigger className="mr-2 hidden sm:flex" />
            <Breadcrumb>
              <BreadcrumbList>
                {displayedBreadcrumbs.map((item, index) => (
                  <BreadcrumbItem key={index}>
                    {index === displayedBreadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-primary-foreground/80">
                        {item.title}
                      </BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink
                          href={item.url}
                          className="max-w-20 truncate hover:text-primary-foreground/80 md:max-w-none"
                        >
                          {item.title}
                        </BreadcrumbLink>
                        {index !== displayedBreadcrumbs.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
                {showEllipsis && <BreadcrumbEllipsis />}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center sm:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </header>
  );
}
