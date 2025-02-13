import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
import { getSession } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({
  children,
}: MainLayoutProps) {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="container-wrapper relative flex flex-1 flex-col">
      <AppHeader user={user} />
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <div className="container flex min-h-screen flex-1 flex-col">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
