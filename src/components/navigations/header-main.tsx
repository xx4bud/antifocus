"use client";

import { IconBrandWhatsapp, IconUser } from "@tabler/icons-react";
import { LogoWhite } from "@/components/shared/logo";
import { Search } from "@/components/shared/search";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n";

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
