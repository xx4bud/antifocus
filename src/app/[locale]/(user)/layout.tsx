import { getLocale } from "next-intl/server";
import { AppFooter } from "~/components/navigations/app-footer";
import { AppHeader } from "~/components/navigations/app-header";
import { NavUser } from "~/components/navigations/nav-user";
import { getServerSession } from "~/features/auth/actions/get-session";
import { getCurrentUser } from "~/features/auth/actions/get-user";
import { redirect } from "~/i18n/navigation";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, session, user] = await Promise.all([
    getLocale(),
    getServerSession(),
    getCurrentUser(),
  ]);

  if (!(session || user)) {
    redirect({ locale, href: "/sign-in" });
  }

  return (
    <div className="relative flex flex-1 flex-col bg-muted">
      <AppHeader user={user} />
      <div className="container min-h-screen flex-1 px-2 py-4 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:gap-4 md:py-2">
        <aside className="hidden border-r md:block">
          <div className="sticky top-20 pr-4">
            <NavUser user={user} variant="menu" />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
      <AppFooter />
    </div>
  );
}
