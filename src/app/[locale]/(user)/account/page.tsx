import type { Metadata } from "next";
import { AccountPage } from "~/features/auth/components/account-page";
import { createMetadata } from "~/utils/seo";

export default function Account() {
  return <AccountPage />;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Akun Saya",
  });
}
