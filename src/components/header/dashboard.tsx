"use client";

import { SidebarTrigger } from "../ui/sidebar";

export function DashboardHeader() {
  return (
    <>
      <header className="border-grid sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-primary/95">
        <div className="container-wrapper flex h-16 flex-1 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="hidden items-center justify-start sm:flex">
            <SidebarTrigger />
          </div>

          <div className="flex flex-1 items-center justify-end sm:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </header>
    </>
  );
}
