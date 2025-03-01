"use client";

import { User } from "next-auth";
import { Logobar } from "./ui/logobar";
import { SearchBar } from "./app-search";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { UserButton } from "./user-button";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/config/site";

interface MainHeaderProps {
  user?: User;
}

export default function MainHeader({
  user,
}: MainHeaderProps) {
  return (
    <nav className="hidden flex-1 items-center justify-between gap-3 md:flex">
      <div className="flex items-center justify-start gap-3 lg:min-w-[250px]">
        <Logobar />
      </div>
      <div className="flex max-w-md flex-1">
        <SearchBar />
      </div>
      <div className="flex items-center justify-end gap-3 lg:min-w-[250px]">
        {user ? (
          <UserButton user={user} />
        ) : (
          <Button asChild variant={"secondary"}>
            <Link href={"/signin"}>
              <UserIcon />
              SignIn
            </Link>
          </Button>
        )}
        <Button asChild variant={"secondary"}>
          <Link
            href={siteConfig.links.whatsapp}
            target="_blank"
          >
            <FaWhatsapp />
            WhatsApp
          </Link>
        </Button>
      </div>
    </nav>
  );
}
