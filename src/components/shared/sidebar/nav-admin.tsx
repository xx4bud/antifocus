"use client";

import {
  Airplay,
  ChevronRight,
  HomeIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavAdmin() {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();

  const onClick = () => {
    setOpenMobile(false);
  };

  const data = [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
      isActive: false,
    },
    {
      title: "Categories",
      url: "#",
      icon: Airplay,
      items: [
        {
          title: "List Categories",
          url: "/admin/categories",
        },
        {
          title: "Add Category",
          url: "/admin/categories/new",
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            className="group/collapsible"
            defaultOpen={false}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  onClick={item.items ? undefined : onClick}
                >
                  <Link
                    href={item.url}
                    className={
                      pathname === item.url
                        ? "font-medium"
                        : ""
                    }
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          pathname === item.url
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    )}
                    <span
                      className={
                        pathname === item.items?.[0].url ||
                        pathname === item.url
                          ? "font-medium"
                          : ""
                      }
                    >
                      {item.title}
                    </span>
                    {item.items &&
                      item.items.length > 0 && (
                        <ChevronRight
                          className={cn(
                            "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90",
                            pathname === item.url &&
                              "text-primary"
                          )}
                        />
                      )}
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && item.items.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.url}>
                        <SidebarMenuSubButton
                          asChild
                          onClick={onClick}
                        >
                          <Link href={subItem.url}>
                            <span
                              className={
                                pathname === subItem.url
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
