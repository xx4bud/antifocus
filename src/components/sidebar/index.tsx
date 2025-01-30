"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { UserNav } from "../menu/user-nav";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaRegUser } from "react-icons/fa6";
import { NavMain } from "./nav-main";

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  dashboard?: boolean;
  user?: User;
}
export function AppSidebar({
  dashboard,
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar
      collapsible={dashboard ? "icon" : "offcanvas"}
      {...props}
    >
      <SidebarHeader>
        {user ? (
          <UserNav user={user} />
        ) : (
          <Link href={"/signin"}>
            <Button className="w-full">
              <FaRegUser />
              SignIn
            </Button>
          </Link>
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {!dashboard && <NavMain />}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
