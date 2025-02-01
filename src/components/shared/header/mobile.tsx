"use client";

import * as React from "react";
import { User } from "next-auth";
import { LogoBar } from "@/components/ui/logobar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { UserNav } from "../user-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { NavMain } from "../sidebar/nav-main";
import {
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { MobileSidebar } from "../sidebar/mobile";

interface MobileHeaderProps {
  user?: User;
}

export default function MobileHeader({
  user,
}: MobileHeaderProps) {
  return (
    <>
      <Sheet>
        <div className="flex h-16 flex-1 shrink-0 items-center justify-between sm:hidden">
          <div className="flex items-center justify-start">
            <LogoBar />
          </div>
          <div className="flex items-center justify-end">
            <SheetTrigger asChild>
              <button>
                <MenuIcon className="size-9" />
              </button>
            </SheetTrigger>
          </div>
        </div>
        <MobileSidebar user={user} />
      </Sheet>
    </>
  );
}
