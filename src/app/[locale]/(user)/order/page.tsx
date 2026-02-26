import {
  IconCheck,
  IconClock,
  IconPrinter,
  IconTruckDelivery,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { createMetadata } from "~/utils/seo";

export const metadata: Metadata = createMetadata({
  title: "Pesanan Saya",
  description: "Daftar riwayat dan status pesanan cetak digital Anda.",
});

// Dummy Data
const DUMMY_ORDERS = [
  {
    id: "INV-20260226-003",
    date: "26 Feb 2026, 14:30",
    status: "Dikirim",
    statusColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    statusIcon: <IconTruckDelivery className="mr-1 size-3.5" />,
    items: [
      {
        id: "item-1",
        name: "Stiker Vinyl Custom (A4 - Glossy)",
        qty: 5,
        price: 35000,
        image: "https://picsum.photos/seed/print11/100/100",
      },
    ],
    total: 185000, // Termasuk ongkir 10.000
    resi: "TLK123456789ID",
  },
  {
    id: "INV-20260225-112",
    date: "25 Feb 2026, 09:15",
    status: "Diproses",
    statusColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
    statusIcon: <IconPrinter className="mr-1 size-3.5" />,
    items: [
      {
        id: "item-2",
        name: "Kartu Nama Premium (1 Box - Doff)",
        qty: 2,
        price: 50000,
        image: "https://picsum.photos/seed/print15/100/100",
      },
      {
        id: "item-3",
        name: "Lanyard ID Card Printing (Satuan)",
        qty: 1,
        price: 25000,
        image: "https://picsum.photos/seed/print24/100/100",
      },
    ],
    total: 135000, // Ongkir 10.000
  },
  {
    id: "INV-20260210-045",
    date: "10 Feb 2026, 16:45",
    status: "Selesai",
    statusColor: "text-green-600 bg-green-50 dark:bg-green-950/30",
    statusIcon: <IconCheck className="mr-1 size-3.5" />,
    items: [
      {
        id: "item-4",
        name: "X-Banner 60x160cm (Flexi Korea)",
        qty: 1,
        price: 95000,
        image: "https://picsum.photos/seed/print13/100/100",
      },
    ],
    total: 110000, // Ongkir 15.000
  },
];

export default function OrderPage() {
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="flex flex-col gap-6 py-4 md:py-8 lg:px-6">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            Pesanan Saya
          </h1>
          <p className="text-muted-foreground text-sm">
            Lacak dan kelola semua riwayat transaksi cetak digital Anda di sini.
          </p>
        </div>
      </div>

      {/* Tabs / Filters (Visual Only for Dummy) */}
      <div className="no-scrollbar flex w-full overflow-x-auto border-b pb-0">
        <div className="flex gap-6">
          <button
            className="border-primary border-b-2 pb-3 font-medium text-foreground text-sm"
            type="button"
          >
            Semua Pesanan
          </button>
          <button
            className="border-transparent border-b-2 pb-3 text-muted-foreground text-sm hover:text-foreground"
            type="button"
          >
            Belum Bayar
          </button>
          <button
            className="border-transparent border-b-2 pb-3 text-muted-foreground text-sm hover:text-foreground"
            type="button"
          >
            Diproses
          </button>
          <button
            className="border-transparent border-b-2 pb-3 text-muted-foreground text-sm hover:text-foreground"
            type="button"
          >
            Dikirim
          </button>
          <button
            className="border-transparent border-b-2 pb-3 text-muted-foreground text-sm hover:text-foreground"
            type="button"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-4">
        {DUMMY_ORDERS.map((order) => (
          <div
            className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            key={order.id}
          >
            {/* Order Header */}
            <div className="flex flex-col justify-between gap-3 border-b bg-muted/30 px-5 py-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">{order.id}</span>
                <span className="hidden text-muted-foreground text-xs sm:inline-block">
                  •
                </span>
                <div className="flex items-center text-muted-foreground text-xs">
                  <IconClock className="mr-1 size-3.5" />
                  {order.date}
                </div>
              </div>
              <div
                className={`inline-flex items-center self-start rounded-full px-2.5 py-1 font-medium text-xs sm:self-auto ${order.statusColor}`}
              >
                {order.statusIcon}
                {order.status}
              </div>
            </div>

            {/* Order Items */}
            <div className="flex flex-col gap-4 p-5">
              {order.items.map((item) => (
                <div className="flex items-start gap-4" key={item.id}>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image
                      alt={item.name}
                      className="object-cover"
                      fill
                      sizes="64px"
                      src={item.image}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-between">
                    <div className="flex flex-col">
                      <h4 className="line-clamp-2 font-medium text-sm">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {item.qty} x {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="font-medium text-sm sm:text-right">
                      {formatRupiah(item.qty * item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex flex-col justify-between gap-4 border-t bg-card px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex flex-col">
                <span className="mb-1 text-muted-foreground text-xs">
                  Total Belanja
                </span>
                <span className="font-bold text-lg text-primary">
                  {formatRupiah(order.total)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Lihat Detail
                </Button>
                {order.status === "Selesai" ? (
                  <Button size="sm">Beli Lagi</Button>
                ) : order.status === "Dikirim" ? (
                  <Button size="sm">Lacak Pesanan</Button>
                ) : (
                  <Button
                    className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                    size="sm"
                    variant="outline"
                  >
                    Hubungi CS
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
