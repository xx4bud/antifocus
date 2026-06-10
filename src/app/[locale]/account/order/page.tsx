import type { Metadata } from "next";
import { getLocaleParams } from "@/lib/i18n/request";
import { constructMetadata } from "@/lib/utils/seo";

// interface Props {
//   params: Promise<{ locale: string }>;
// }

export default async function AccountOrderPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="font-bold text-2xl tracking-tight">Account Order</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await getLocaleParams(params);

  return constructMetadata({
    title: "Account Order",
    description: "Coming soon...",
    locale,
    path: "/account/order",
  });
}
