import type { ReactNode } from "react";
import { AppFooter } from "@/components/navigations/app-footer";
import { AppHeader } from "@/components/navigations/app-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      <AppHeader />
      <div className="container flex min-h-screen flex-1 flex-col items-center justify-center">
        <main className="w-full md:max-w-md">{children}</main>
      </div>
      <AppFooter />
    </div>
  );
}
