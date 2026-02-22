import { BottomTabs } from "~/components/navigations/bottom-tabs";
import { Fabs } from "~/components/navigations/fabs";
import { FooterMain } from "~/components/navigations/footer-main";

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
