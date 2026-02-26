import { IconSearch } from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lacak Pesanan | Antifocus",
  description: "Lacak status pesanan cetak Anda secara real-time.",
};

export default function TrackOrderPage() {
  return (
    <main className="container flex max-w-2xl flex-1 flex-col items-center justify-center py-12 md:py-24">
      <div className="mb-10 flex w-full flex-col gap-4 text-center">
        <h1 className="font-bold text-3xl text-foreground tracking-tight md:text-5xl">
          Lacak Pesanan
        </h1>
        <p className="text-lg text-muted-foreground">
          Masukkan Nomor Pesanan (Order ID) Anda untuk melihat status produksi
          dan pengiriman pesanan Anda secara real-time.
        </p>
      </div>

      <div className="w-full rounded-2xl border bg-card p-6 shadow-sm md:p-8">
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="orderId"
            >
              Nomor Pesanan (Order ID)
            </label>
            <input
              className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="orderId"
              placeholder="Contoh: INV-202X0101-0001"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Email Pembeli
            </label>
            <input
              className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="Email yang digunakan saat checkout"
              type="email"
            />
          </div>

          <button
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-8 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            type="button"
          >
            <IconSearch className="size-4" />
            Lacak Sekarang
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-muted-foreground text-sm">
        Order ID dapat Anda temukan pada email invoice atau di halaman riwayat
        pesanan (jika Anda memiliki akun).
      </div>
    </main>
  );
}
