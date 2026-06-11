import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { getLocaleParams } from "@/lib/i18n/request";
import { constructMetadata } from "@/lib/utils/seo";

export default async function SignUpPage() {
  return <SignUpForm />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await getLocaleParams(params);

  return constructMetadata({
    title: "Sign Up",
    description: "Create your Antifocus account",
    locale,
    path: "/sign-up",
  });
}
