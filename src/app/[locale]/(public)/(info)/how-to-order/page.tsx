import {
  IconCheck,
  IconCreditCard,
  IconFileCheck,
  IconPackage,
  IconPrinter,
  IconUpload,
} from "@tabler/icons-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cara Pesan | Antifocus",
  description: "Langkah mudah memesan cetakan digital di Antifocus.",
};

export default function HowToOrderPage() {
  const steps = [
    {
      title: "Pilih Produk & Spesifikasi",
      desc: "Telusuri katalog produk kami (Stiker, Banner, dll). Pilih spesifikasi yang Anda inginkan (bahan, ukuran, finishing, dan jumlah).",
      icon: <IconCheck className="size-6 text-primary" />,
    },
    {
      title: "Unggah File Desain",
      desc: "Upload file desain Anda langsung di halaman produk. Pastikan file dalam format hig-res (PDF, AI, CDR) dan menggunakan color mode CMYK.",
      icon: <IconUpload className="size-6 text-primary" />,
    },
    {
      title: "Lakukan Pembayaran",
      desc: "Checkout pesanan Anda dan pilih metode pembayaran (Transfer Bank, QRIS, Virtual Account, atau E-Wallet).",
      icon: <IconCreditCard className="size-6 text-primary" />,
    },
    {
      title: "Pengecekan File (Pre-Flight)",
      desc: "Tim pracetak kami akan mengecek kelayakan file Anda. Jika ada masalah (resolusi kecil, tidak bleed), kami akan menghubungi Anda.",
      icon: <IconFileCheck className="size-6 text-primary" />,
    },
    {
      title: "Proses Produksi",
      desc: "Setelah file ACC dan pembayaran dikonfirmasi, pesanan Anda akan langsung masuk antrean cetak digital/offset kami.",
      icon: <IconPrinter className="size-6 text-primary" />,
    },
    {
      title: "Pengiriman / Ambil di Toko",
      desc: "Pesanan selesai! Kami akan mengirimkannya via kurir pilihan Anda, atau Anda dapat mengambilnya langsung di workshop kami.",
      icon: <IconPackage className="size-6 text-primary" />,
    },
  ];

  return (
    <main className="container max-w-4xl py-12 md:py-24">
      <div className="mb-16 flex flex-col gap-4 text-center">
        <h1 className="font-bold text-3xl text-foreground tracking-tight md:text-5xl">
          Cara Pesan
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Proses pemesanan cetak di Antifocus sangat mudah, transparan, dan 100%
          online. Ikuti 6 langkah sederhana berikut.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <div
            className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            key={step.title}
          >
            <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10">
              {step.icon}
            </div>
            <h3 className="font-bold text-xl">
              {i + 1}. {step.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
