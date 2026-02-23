import type { Metadata } from "next";
import { VerifyEmailPage } from "~/features/auth/components/verify-email-page";
import { createMetadata } from "~/utils/seo";

export default function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <VerifyEmailPage searchParams={searchParams} />;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Verifikasi Email",
  });
}
