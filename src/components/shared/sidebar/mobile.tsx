"use client";

import { SheetContent } from "@/components/ui/sheet";
import {
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { UserNav } from "../user-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa6";
import { NavMain } from "./nav-main";

interface MobileSidebarProps {
  user?: User;
}

export function MobileSidebar({
  user,
}: MobileSidebarProps) {
  return (
    <SheetContent
      side="left"
      className="w-[18rem] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
    >
      <div className="flex h-full w-full flex-col">
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
        <NavMain />
      </div>
    </SheetContent>
  );
}
