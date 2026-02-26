import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Antifocus",
  description: "Syarat dan Ketentuan Layanan Antifocus Digital Printing.",
};

export default function TermsPage() {
  return (
    <main className="container max-w-4xl py-12 md:py-24">
      <div className="mb-12 flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-foreground tracking-tight md:text-5xl">
          Syarat & Ketentuan
        </h1>
        <p className="text-lg text-muted-foreground">
          Terakhir diperbarui: 26 Februari 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            1. Pendahuluan
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Selamat datang di Antifocus. Syarat dan Ketentuan ("Ketentuan") ini
            mengatur akses dan penggunaan Anda atas situs web, layanan, dan
            platform Antifocus ("Layanan"). Dengan menggunakan Layanan kami,
            Anda menyetujui Ketentuan ini secara penuh.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            2. Layanan Cetak
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>2.1 Kelayakan File:</strong> Klien bertanggung jawab penuh
              atas kualitas file desain yang diunggah. Kami menyarankan resolusi
              minimum 300dpi dengan format CMYK.
            </p>
            <p>
              <strong>2.2 Hak Cipta:</strong> Anda menjamin bahwa Anda memiliki
              hak hukum atas semua desain, logo, dan konten yang Anda kirimkan
              untuk dicetak. Antifocus tidak bertanggung jawab atas pelanggaran
              hak cipta intelektual pihak ketiga.
            </p>
            <p>
              <strong>2.3 Toleransi Warna:</strong> Terdapat toleransi perbedaan
              warna antara tampilan layar (RGB) dengan hasil cetak akhir (CMYK)
              sekitar 10-15%. Hal ini adalah wajar dalam industri pencetakan
              letak.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            3. Pemesanan & Pembayaran
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              <strong>3.1 Konfirmasi:</strong> Pesanan hanya akan diproses
              setelah pembayaran lunas atau uang muka (DP) diterima sesuai
              kesepakatan.
            </p>
            <p>
              <strong>3.2 Kebijakan Pembatalan:</strong> Pesanan yang sudah
              masuk tahap produksi (naik cetak) tidak dapat dibatalkan atau
              diubah (No Cancel, No Refund).
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            4. Pengiriman & Pengambilan
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Estimasi durasi pengiriman bergantung pada layanan kurir yang
            dipilih oleh pelanggan. Risiko kerusakan atau kehilangan selama
            pengiriman oleh pihak ketiga (ekspedisi) merupakan tanggung jawab
            pihak ekspedisi, namun kami akan membantu proses klaim asuransi jika
            tersedia.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            5. Garansi & Komplain
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Antifocus memberikan garansi cetak ulang 100% jika terjadi kesalahan
            produksi dari pihak kami (contoh: salah potong, hasil cetak bergaris
            parah yang bukan dari file asli). Komplain harus diajukan maksimal
            2x24 jam sejak barang diterima, disertai bukti foto/video unboxing.
          </p>
        </section>
      </div>
    </main>
  );
}
