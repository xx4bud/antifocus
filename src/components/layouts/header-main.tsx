"use client";

import { IconBrandWhatsapp, IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/link";
import { LogoWhite } from "../ui/logo";
import { Search } from "../ui/search";

export function HeaderMain() {
  return (
    <nav className="hidden flex-1 items-center justify-between gap-3 md:flex">
      <div className="flex items-center justify-start gap-3 lg:min-w-[250px]">
        <LogoWhite href={"/"} />
      </div>
      <div className="flex max-w-md flex-1 px-4">
        <Search />
      </div>

      <div className="flex items-center justify-end gap-3 lg:min-w-[250px]">
        <Button
          asChild
          className="bg-background"
          size={"lg"}
          variant={"secondary"}
        >
          <Link href={"/sign-in"}>
            <IconUser />
            Masuk
          </Link>
        </Button>

        <Button
          asChild
          className="bg-background"
          size={"lg"}
          variant={"secondary"}
        >
          <Link href={"https://wa.me/6289602808726"}>
            <IconBrandWhatsapp />
            WhatsApp
          </Link>
        </Button>
      </div>
    </nav>
  );
}
