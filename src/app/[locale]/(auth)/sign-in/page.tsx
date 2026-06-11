import type { Metadata } from "next";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getLocaleParams } from "@/lib/i18n/request";
import { constructMetadata } from "@/lib/utils/seo";

export default async function SignInPage() {
  return <SignInForm />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await getLocaleParams(params);

  return constructMetadata({
    title: "Sign In",
    description: "Access your Antifocus account",
    locale,
    path: "/sign-in",
  });
}
