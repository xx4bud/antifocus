"use client";

import {
  BoxesIcon,
  ChevronRight,
  HomeIcon,
  InfoIcon,
  PhoneIcon,
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
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAllFeaturedCategories } from "@/actions/category.actions";

export function NavMain() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllFeaturedCategories(),
  });

  const { setOpen, setOpenMobile } = useSidebar();
  const pathname = usePathname();

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
      icon: BoxesIcon,
      items: categories?.map((category) => ({
        title: category.name,
        url: `/category/${category.slug}`,
      })),
    },
    {
      title: "About",
      url: "/about",
      icon: InfoIcon,
    },
    {
      title: "Contact",
      url: "/contact",
      icon: PhoneIcon,
    },
  ];

  const onClick = () => {
    setOpen(false);
    setOpenMobile(false);
  };

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
                    <span>{item.title}</span>
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
