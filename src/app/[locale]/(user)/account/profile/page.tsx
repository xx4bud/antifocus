import type { Metadata } from "next";
import { getCurrentUser } from "~/features/auth/actions/get-user";
import { ProfileForm } from "~/features/auth/components/profile-form";
import { createMetadata } from "~/utils/seo";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-2">
      <div className="mb-6 space-y-1">
        <h1 className="font-bold text-2xl tracking-tight">Informasi Pribadi</h1>
        <p className="text-muted-foreground text-sm">
          Kelola informasi profil Anda
        </p>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Informasi Pribadi",
  });
}
