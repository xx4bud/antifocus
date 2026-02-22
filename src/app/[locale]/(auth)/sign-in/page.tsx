import type { Metadata } from "next";
import { SignInPage } from "~/features/auth/components/sign-in-page";
import { createMetadata } from "~/utils/seo";

export default function SignIn() {
  return <SignInPage />;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Masuk",
  });
}
