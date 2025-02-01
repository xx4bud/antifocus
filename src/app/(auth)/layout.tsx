import { AppFooter } from "@/components/shared/footer";
import { AppHeader } from "@/components/shared/header";
import { getSession } from "@/lib/utils";
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
    return redirect("/");
  }

  return (
    <div className="border-grid flex flex-1 flex-col">
      <AppHeader user={user} />
      <main className="flex flex-1 min-h-svh flex-grow flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
