import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getOrganizationBySlug,
  getProductBySlug,
  getUserByUsername,
  resolveSlug,
} from "~/features/home/actions/get-home-data";
import { CategoryPage } from "~/features/home/components/category-page";
import { OrganizationPage } from "~/features/home/components/organization-page";
import { ProductPage } from "~/features/home/components/product-page";
import { UserPage } from "~/features/home/components/user-page";
import { createMetadata } from "~/utils/seo";

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const primarySlug = slug[0];
  if (!primarySlug) {
    return createMetadata({ title: "Not Found" });
  }

  const resolved = await resolveSlug(primarySlug);
  if (!resolved) {
    return createMetadata({ title: "Not Found" });
  }

  switch (resolved.type) {
    case "category": {
      const cat = await getCategoryBySlug(primarySlug);
      return createMetadata({
        title: cat?.name ?? "Kategori",
        description: `Jelajahi produk dalam kategori ${cat?.name}`,
      });
    }
    case "product": {
      const prod = await getProductBySlug(primarySlug);
      return createMetadata({
        title: prod?.name ?? "Produk",
        description: prod?.description ?? undefined,
      });
    }
    case "organization": {
      const org = await getOrganizationBySlug(primarySlug);
      return createMetadata({
        title: org?.name ?? "Organisasi",
        description: `Lihat profil dan produk dari ${org?.name}`,
      });
    }
    case "user": {
      const user = await getUserByUsername(primarySlug);
      return createMetadata({
        title: user?.name ?? "User",
        description: `Profil ${user?.name}`,
      });
    }
    default:
      return createMetadata({ title: "Not Found" });
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const primarySlug = slug[0];

  if (!primarySlug) {
    notFound();
  }

  const resolved = await resolveSlug(primarySlug);

  if (!resolved) {
    notFound();
  }

  switch (resolved.type) {
    case "category": {
      const category = await getCategoryBySlug(primarySlug);
      if (!category) {
        notFound();
      }
      return <CategoryPage category={category} />;
    }

    case "product": {
      const product = await getProductBySlug(primarySlug);
      if (!product) {
        notFound();
      }
      return <ProductPage product={product} />;
    }

    case "organization": {
      const organization = await getOrganizationBySlug(primarySlug);
      if (!organization) {
        notFound();
      }
      return <OrganizationPage organization={organization} />;
    }

    case "user": {
      const user = await getUserByUsername(primarySlug);
      if (!user) {
        notFound();
      }
      return <UserPage user={user} />;
    }

    default:
      notFound();
  }
}
