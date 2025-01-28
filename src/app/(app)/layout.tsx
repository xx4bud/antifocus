import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getSession } from "@/lib/queries";

interface AppLayoutProps {
  children: React.ReactNode;
}
export default async function AppLayout({
  children,
}: AppLayoutProps) {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="border-grid flex flex-1 flex-col">
      <AppHeader user={user} />
      <main className="flex flex-1 flex-grow flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
