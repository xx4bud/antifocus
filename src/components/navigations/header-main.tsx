import { IconBrandWhatsapp, IconUser } from "@tabler/icons-react";
import { NavUser } from "~/components/navigations/nav-user";
import { Button } from "~/components/ui/button";
import { LogoWhite } from "~/components/ui/logo";
import { NavLink } from "~/components/ui/nav-link";
import { SearchBar } from "~/components/ui/search";
import type { User } from "~/lib/db/types";

interface HeaderMainProps {
  user: User | null;
}

export function HeaderMain({ user }: HeaderMainProps) {
  return (
    <nav className="hidden flex-1 items-center justify-between gap-3 md:flex">
      <div className="flex items-center justify-start gap-3 lg:min-w-[250px]">
        <LogoWhite href={"/"} />
      </div>
      <div className="flex max-w-md flex-1 px-4">
        <SearchBar />
      </div>

      <div className="flex items-center justify-end gap-3 lg:min-w-[250px]">
        {user ? (
          <NavUser user={user} />
        ) : (
          <Button asChild variant={"secondary"}>
            <NavLink href={"/sign-in"}>
              <IconUser className="size-5" />
              Masuk
            </NavLink>
          </Button>
        )}

        <Button asChild variant={"secondary"}>
          <NavLink href={"https://wa.me/6289602808726"} target="_blank">
            <IconBrandWhatsapp className="size-5" />
            WhatsApp
          </NavLink>
        </Button>
      </div>
    </nav>
  );
}
