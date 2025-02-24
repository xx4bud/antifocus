import { getCurrentUser } from "@/actions/user";
import { MobileHeader } from "./mobile-header";
import MainHeader from "./main-header";

export async function AppHeader() {
  const user = await getCurrentUser();
  return (
    <>
      <header className="sticky top-0 z-50 bg-foreground text-background shadow backdrop-blur supports-[backdrop-filter]:bg-foreground/95">
        <nav className="container flex h-16 flex-1 shrink-0 items-center justify-between px-3 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <MainHeader user={user} />
          <MobileHeader />
        </nav>
      </header>
    </>
  );
}
