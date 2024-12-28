"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Lock,
  LogOut,
  Settings,
  Settings2,
  Sparkles,
  User2,
  UserIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { signOutUser } from "@/app/(auth)/actions";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  const { setOpen, setOpenMobile } = useSidebar();

  const onClick = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="cursor-pointer hover:opacity-90">
                <AvatarImage
                  src={
                    user.image || "/avatar-placeholder.png"
                  }
                  alt={user.name || user.slug}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0) ||
                    user.slug.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.name || user.slug}
                </span>
                <span className="truncate text-xs">
                  {user.email || `@${user.slug}`}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
            onClick={onClick}
          >
            <DropdownMenuGroup>
              {user.role === "ADMIN" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Lock />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {user.role === "USER" && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
