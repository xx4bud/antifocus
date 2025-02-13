// src/app/(auth)/layout.tsx
import { AppFooter } from "@/components/shared/app-footer";
import { AppHeader } from "@/components/shared/app-header";
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

  if (session) {
    return redirect("/");
  }

  return (
    <div className="border-grid relative flex flex-1 flex-col">
      <AppHeader user={user} />
      <div className="flex min-h-svh flex-1 flex-grow flex-col">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
