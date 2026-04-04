import { AppFooter } from "@/components/layouts/app-footer";
import { AppHeader } from "@/components/layouts/app-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      <AppHeader />
      <main className="container flex min-h-svh flex-1 flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
