"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { NavUser } from "./nav-user";
import { NavAdmin } from "./nav-admin";

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  user?: User;
}

export function AppSidebar({
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {user ? (
          <NavUser user={user} />
        ) : (
          <Button asChild>
            <Link href={"/signin"}>
              <UserIcon />
              SignIn
            </Link>
          </Button>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {user?.role === "ADMIN" && <NavAdmin />}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
