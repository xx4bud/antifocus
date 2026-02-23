import type { Metadata } from "next";
import { ForgotPasswordPage } from "~/features/auth/components/forgot-password-page";
import { createMetadata } from "~/utils/seo";

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Lupa Password",
  });
}
