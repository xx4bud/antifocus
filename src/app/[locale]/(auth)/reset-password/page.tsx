import type { Metadata } from "next";
import { ResetPasswordPage } from "~/features/auth/components/reset-password-page";
import { createMetadata } from "~/utils/seo";

export default function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return <ResetPasswordPage searchParams={searchParams} />;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Lupa Password",
  });
}
