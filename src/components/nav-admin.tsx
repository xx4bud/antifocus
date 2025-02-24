"use client";

import {
  Boxes,
  ChevronRight,
  HomeIcon,
  Images,
  PackageSearch,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import Link from "next/link";

interface NavAdminProps {
  label?: boolean;
}

export function NavAdmin({ label = true }: NavAdminProps) {
  // navAdmin
  const items = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: HomeIcon,
    },
    {
      name: "Category",
      href: "#",
      icon: Boxes,
      isActive: false,
      items: [
        {
          name: "Category List",
          href: "/admin/category",
        },
        {
          name: "Add New Category",
          href: "/admin/category/new",
        },
      ],
    },
    {
      name: "Product",
      href: "#",
      icon: PackageSearch,
      isActive: false,
      items: [
        {
          name: "Product List",
          href: "/admin/product",
        },
        {
          name: "Add New Product",
          href: "/admin/product/new",
        },
      ],
    },
    {
      name: "User",
      href: "#",
      icon: Users,
      isActive: false,
      items: [
        {
          name: "User List",
          href: "/admin/user",
        },
        {
          name: "Add New User",
          href: "/admin/user/new",
        },
      ],
    },
    {
      name: "Media",
      href: "#",
      icon: Images,
      isActive: false,
      items: [
        {
          name: "Media List",
          href: "/admin/media",
        },
        {
          name: "Add New Media",
          href: "/admin/media/new",
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems =
            item.items && item.items.length > 0;

          return hasSubItems ? (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.name}>
                    {item.icon && (
                      <item.icon className="h-4 w-4" />
                    )}
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.name}
                      >
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.href}>
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
              >
                <Link href={item.href}>
                  {item.icon && (
                    <item.icon className="h-4 w-4" />
                  )}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
