"use client";

import { Fabs } from "./fabs";
import Copyright from "./copyright";

export function AppFooter() {
  return (
    <>
      <Fabs className="md:hidden" />
      <footer className="border-t bg-secondary text-secondary-foreground">
        <div className="container flex flex-1 px-3 items-center">
          <Copyright />
        </div>
      </footer>
    </>
  );
}
