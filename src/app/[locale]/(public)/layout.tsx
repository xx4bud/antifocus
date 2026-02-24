import { AppFooter } from "~/components/navigations/app-footer";
import { AppHeader } from "~/components/navigations/app-header";
import { getCurrentUser } from "~/features/auth/actions/get-user";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="relative flex flex-1 flex-col bg-muted">
      <AppHeader user={user} />
      <div className="container flex min-h-screen flex-1 flex-col">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
