"use client";

import { LogoBar } from "@/components/ui/logobar";
import { SearchBar } from "@/components/ui/searchbar";
import { User } from "next-auth";
import * as React from "react";
import { UserButton } from "../user-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegUser, FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/config/site";

interface MainHeaderProps {
  user?: User;
}

export function MainHeader({ user }: MainHeaderProps) {
  return (
    <div className="hidden h-16 flex-1 shrink-0 items-center justify-between transition-[width,height] ease-linear sm:flex">
      <div className="flex items-center justify-start space-x-4 md:min-w-[250px]">
        <LogoBar />
      </div>

      <div className="mx-4 hidden max-w-md flex-1 items-center md:flex">
        <SearchBar />
      </div>

      <div className="flex items-center justify-end space-x-4 md:min-w-[250px]">
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
    </div>
  );
}
