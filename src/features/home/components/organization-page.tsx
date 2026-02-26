import { IconBuildingStore } from "@tabler/icons-react";
import Image from "next/image";

import { Link } from "~/i18n/navigation";

interface OrgProduct {
  basePrice: string;
  currency: string;
  id: string;
  name: string;
  slug: string;
}

interface OrganizationPageProps {
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    status: string;
    settings: unknown;
    metadata: unknown;
    products: OrgProduct[];
    createdAt: Date;
  };
}

function formatCurrency(amount: string, currency: string) {
  const num = Number.parseFloat(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function OrganizationPage({ organization }: OrganizationPageProps) {
  return (
    <main className="flex w-full flex-1 flex-col gap-6 py-6">
      {/* Org Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
        <div className="relative z-10 flex items-center gap-6">
          {organization.logo ? (
            <Image
              alt={organization.name}
              className="size-20 rounded-2xl border-2 border-primary/20 object-cover shadow-lg"
              height={80}
              src={organization.logo}
              width={80}
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <IconBuildingStore className="size-10" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
              {organization.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {organization.products.length} produk • Bergabung{" "}
              {new Date(organization.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Produk</h2>
        {organization.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 py-16">
            <IconBuildingStore className="mb-3 size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">Belum ada produk</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {organization.products.map((product) => (
              <Link
                className="group overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                href={{ pathname: "/[slug]", params: { slug: product.slug } }}
                key={product.id}
              >
                <div className="aspect-square bg-muted" />
                <div className="p-3">
                  <h3 className="line-clamp-2 font-semibold text-sm transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  <span className="mt-1 block font-bold text-primary text-sm tabular-nums">
                    {formatCurrency(product.basePrice, product.currency)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
