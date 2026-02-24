import type { Metadata } from "next";
import { getCurrentUser } from "~/features/auth/actions/get-user";
import { SecurityForm } from "~/features/user/components/security-form";
import { createMetadata } from "~/utils/seo";

export default async function SecurityPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-2">
      <div className="mb-6 space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Keamanan</h1>
        <p className="text-muted-foreground text-sm">
          Kelola keamanan akun Anda
        </p>
      </div>
      <SecurityForm user={user} />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Keamanan",
  });
}
