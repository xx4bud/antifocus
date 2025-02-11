"use client";

import { User } from "next-auth";
import * as React from "react";
import {
  Sidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UserNav } from "../user-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa6";

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
    </Sidebar>
  );
}
