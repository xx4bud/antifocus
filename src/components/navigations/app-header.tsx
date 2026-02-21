import { HeaderMobile } from "~/components/navigations/header-mobile";
import type { User } from "~/lib/db/types";
import { HeaderMain } from "./header-main";

interface AppHeaderProps {
  user: User | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-primary text-secondary backdrop-blur supports-backdrop-filter:bg-primary/95">
      <div className="container flex h-16 flex-1 shrink-0 items-center justify-between px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <HeaderMain user={user} />
        <HeaderMobile />
      </div>
    </header>
  );
}
