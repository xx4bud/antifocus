"use client";

import { Button } from "@/components/ui/button";
import { LogoBar } from "@/components/ui/logobar";
import { siteConfig } from "@/config/site";
import { User } from "next-auth";
import { FaRegUser, FaWhatsapp } from "react-icons/fa6";
import { UserButton } from "../user-button";
import Link from "next/link";
import { Suspense } from "react";

interface AppHeaderProps {
  user?: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <>
      <header className="container-wrapper sticky top-0 z-50 border-b bg-foreground text-background backdrop-blur supports-[backdrop-filter]:bg-foreground/95">
        <div className="container">
          <div className="flex h-16 flex-1 shrink-0 items-center justify-between px-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center justify-start space-x-3 md:min-w-[250px]">
              <LogoBar />
            </div>
            <div className="hidden items-center justify-end space-x-3 md:flex md:min-w-[250px]">
              <Suspense>
                {user ? (
                  <UserButton user={user} />
                ) : (
                  <Link href={"/signin"}>
                    <Button variant={"bordered"}>
                      <FaRegUser />
                      SignIn
                    </Button>
                  </Link>
                )}
              </Suspense>

              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
              >
                <Button variant={"secondary"}>
                  <FaWhatsapp />
                  WhatsApp
                </Button>
              </Link>
            </div>
            <div className="flex max-w-md items-center gap-3 md:hidden">
              {/* <SidebarTrigger /> */}
              <Suspense>
                {user ? (
                  <UserButton user={user} />
                ) : (
                  <Link href={"/signin"}>
                    <Button variant={"bordered"}>
                      <FaRegUser />
                      SignIn
                    </Button>
                  </Link>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
