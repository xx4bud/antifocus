"use client";

import { User } from "next-auth";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { UserMenu } from "./user-menu";
import { ChevronsUpDownIcon } from "lucide-react";

interface UserNavProps {
  badge?: boolean;
  user: User;
}

export function UserNav({ badge, user }: UserNavProps) {
  const { setOpenMobile } = useSidebar();

  const onClick = () => {
    setOpenMobile(false);
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem onClick={onClick}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={
                    user.photos?.[0].url ||
                    user.image ||
                    "/avatar-placeholder.jpg"
                  }
                  alt={user.name || user.slug}
                />
                <AvatarFallback className="size-8 rounded-lg">
                  {user.name?.charAt(0) ||
                    user.slug.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.name}
                </span>
                {badge ? (
                  <span className="truncate text-xs">
                    {user.role}
                  </span>
                ) : (
                  <span className="truncate text-xs">
                    {user.email}
                  </span>
                )}
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] cursor-default"
            side="bottom"
            align="start"
            sideOffset={8}
          >
            <UserMenu user={user} username={false} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
