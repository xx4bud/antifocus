import { IconSearch } from "@tabler/icons-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "~/features/home/actions/get-home-data";
import { ProductCard } from "~/features/home/components/product-card";
import { SearchFilters } from "~/features/home/components/search-filters";
import { createMetadata } from "~/utils/seo";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Cari Produk",
    description: "Cari produk cetak digital di Antifocus",
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const sortBy =
    (params.sort as
      | "newest"
      | "oldest"
      | "price_asc"
      | "price_desc"
      | "name") ?? "newest";

  const results = query.trim()
    ? await searchProducts({ query, limit: 20, sortBy })
    : null;

  return (
    <main className="flex w-full flex-1 flex-col gap-6 py-6">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Cari Produk</h1>
        {query && (
          <p className="text-muted-foreground text-sm">
            {results
              ? `${results.total} hasil untuk "${query}"`
              : `Mencari "${query}"...`}
          </p>
        )}
      </div>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchFilters currentQuery={query} currentSort={sortBy} />
      </Suspense>

      {/* Results */}
      {query ? (
        results && results.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-4 py-16 text-center">
              <IconSearch className="mb-4 size-10 text-muted-foreground/40" />
              <p className="font-semibold text-foreground">
                Oops! Produk tidak ditemukan
              </p>
              <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                Kami tidak dapat menemukan produk yang cocok dengan "{query}".
                Coba kata kunci yang lebih umum.
              </p>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-lg">Mungkin Anda Suka</h2>
              <Suspense fallback={<SearchSkeleton />}>
                <Recommendations />
              </Suspense>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-4 py-16 text-center">
            <IconSearch className="mb-4 size-10 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">Mulai Pencarian</p>
            <p className="mt-1 max-w-sm text-muted-foreground text-sm">
              Ketik nama produk, kategori, atau bahan (contoh: stiker vinyl, id
              card, spanduk).
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg">Rekomendasi Produk</h2>
            <Suspense fallback={<SearchSkeleton />}>
              <Recommendations />
            </Suspense>
          </div>
        </div>
      )}
    </main>
  );
}

// Komponen Rekomendasi
async function Recommendations() {
  // Ambil beberapa produk secara acak/terbaru sebagai rekomendasi
  const recommendations = await searchProducts({
    query: "",
    limit: 4,
    sortBy: "newest",
  });

  if (!recommendations || recommendations.data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {recommendations.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function SearchSkeleton() {
  return <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />;
}
