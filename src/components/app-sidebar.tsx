"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { menuConfig } from "@/config/menu";
import { NavAdmin } from "@/components/nav-admin";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  badge?: boolean;
  user?: User;
}

export function AppSidebar({
  badge,
  user,
  ...props
}: AppSidebarProps) {
  const { setOpen, setOpenMobile } = useSidebar();

  const handleClick = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {user ? (
          <UserNav user={user} badge={badge} />
        ) : (
          <Link href={"/signin"} onClick={handleClick}>
            <Button className="w-full">
              <FaRegUser />
              SignIn
            </Button>
          </Link>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {user?.role === "ADMIN" && (
          <NavAdmin items={menuConfig.navAdmin} />
        )}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
