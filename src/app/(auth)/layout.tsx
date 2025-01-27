import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getSession } from "@/lib/queries";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default async function AuthLayout({
  children,
}: AuthLayoutProps) {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    redirect("/");
  }

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
