import { BottomTabs } from "./bottom-tabs";
import { Fabs } from "./fabs";
import { FooterMain } from "./footer-main";

export function AppFooter() {
  return (
    <>
      <Fabs className="md:hidden" />
      <footer className="border-t bg-secondary text-muted-foreground">
        <div className="container px-3 pb-16 md:pb-0">
          <FooterMain />
        </div>
      </footer>
      <BottomTabs className="md:hidden" />
    </>
  );
}
