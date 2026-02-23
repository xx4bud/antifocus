import type { Metadata } from "next";
import { SignUpPage } from "~/features/auth/components/sign-up-page";
import { createMetadata } from "~/utils/seo";

export default function SignUp() {
  return <SignUpPage />;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Daftar",
  });
}
