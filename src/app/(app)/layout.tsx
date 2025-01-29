import { AppHeader } from "@/components/header";
import { getSession } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}
export default async function AppLayout({
  children,
}: AppLayoutProps) {
  const session = await getSession();
  return (
    <div className="border-grid flex flex-1 flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-grow flex-col">
        {children}
      </main>
    </div>
  );
}
