import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Antifocus",
  description:
    "Pertanyaan yang sering diajukan seputar layanan cetak digital Antifocus.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Berapa lama waktu pengerjaan untuk pesanan cetak?",
      a: "Waktu pengerjaan standar adalah 1-3 hari kerja tergantung volume dan jenis cetakan. Untuk pesanan express (One Day Service) tersedia dengan biaya tambahan.",
    },
    {
      q: "Apakah saya bisa memesan qty sedikit (satuan)?",
      a: "Ya! Kami melayani cetak satuan untuk sebagian besar produk seperti Stiker, Poster, Kaos Sablon, dan Merchandise. Beberapa item seperti Box Packaging atau Kartu Nama memiliki minimum order tertentu.",
    },
    {
      q: "Format file apa yang sebaiknya saya kirim?",
      a: "Untuk kualitas terbaik, kami menyarankan format PDF, AI, CDR, atau EPS. Jika menggunakan JPG atau PNG, pastikan resolusi minimal 300dpi dengan format warna CMYK.",
    },
    {
      q: "Apakah Antifocus menyediakan layanan desain?",
      a: "Tentu. Jika Anda belum memiliki desain, tim desainer profesional kami siap membantu dengan biaya mulai dari Rp 50.000 per desain.",
    },
    {
      q: "Bagaimana cara melakukan klaim garansi jika hasil cetak cacat?",
      a: "Jika terdapat cacat produksi murni dari pihak kami (warna melenceng jauh, potongan salah, dll), segera hubungi CS kami dalam waktu maksimal 2x24 jam sejak barang diterima. Kami akan mencetak ulang pesanan Anda 100% gratis.",
    },
  ];

  return (
    <main className="container max-w-4xl py-12 md:py-24">
      <div className="mb-12 flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-foreground tracking-tight md:text-5xl">
          FAQ
        </h1>
        <p className="text-lg text-muted-foreground">
          Pertanyaan yang Sering Diajukan (Frequently Asked Questions).
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {faqs.map((faq) => (
          <div
            className="flex flex-col gap-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            key={faq.q}
          >
            <h3 className="font-semibold text-xl">{faq.q}</h3>
            <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-secondary p-8 text-center">
        <h3 className="mb-2 font-semibold text-xl">Masih punya pertanyaan?</h3>
        <p className="mb-6 text-muted-foreground">
          Tim dukungan pelanggan kami siap membantu Anda kapan saja.
        </p>
        <a
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground text-sm shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          href="https://wa.me/6281234567890"
          rel="noreferrer"
          target="_blank"
        >
          Hubungi via WhatsApp
        </a>
      </div>
    </main>
  );
}
