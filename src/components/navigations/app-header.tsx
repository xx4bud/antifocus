import { HeaderMain } from "@/components/navigations/header-main";
import { HeaderMobile } from "@/components/navigations/header-mobile";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-primary text-secondary backdrop-blur supports-backdrop-filter:bg-primary/95">
      <div className="container flex h-16 flex-1 shrink-0 items-center justify-between px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <HeaderMain />
        <HeaderMobile />
      </div>
    </header>
  );
}
