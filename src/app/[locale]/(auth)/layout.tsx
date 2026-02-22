import { getLocale } from "next-intl/server";
import { AppFooter } from "~/components/navigations/app-footer";
import { AppHeader } from "~/components/navigations/app-header";
import { getServerSession } from "~/features/auth/actions/get-session";
import { getCurrentUser } from "~/features/auth/actions/get-user";
import { redirect } from "~/i18n/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, session, user] = await Promise.all([
    getLocale(),
    getServerSession(),
    getCurrentUser(),
  ]);

  if (session || user) {
    redirect({ locale, href: "/" });
  }

  return (
    <div className="relative flex flex-1 flex-col bg-muted">
      <AppHeader user={user} />
      <div className="container flex min-h-svh flex-1 flex-col">{children}</div>
      <AppFooter />
    </div>
  );
}
