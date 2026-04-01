import { AppFooter } from "@/components/navigations/app-footer";
import { AppHeader } from "@/components/navigations/app-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-1 flex-col">
      <AppHeader />
      <div className="container flex min-h-svh flex-1 flex-col">{children}</div>
      <AppFooter />
    </div>
  );
}
