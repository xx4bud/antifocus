import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Antifocus",
  description: "Kebijakan Privasi perlindungan data pelanggan Antifocus.",
};

export default function PrivacyPage() {
  return (
    <main className="container max-w-4xl py-12 md:py-24">
      <div className="mb-12 flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-foreground tracking-tight md:text-5xl">
          Kebijakan Privasi
        </h1>
        <p className="text-lg text-muted-foreground">
          Terakhir diperbarui: 26 Februari 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            1. Pengumpulan Informasi
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Kami mengumpulkan informasi pribadi yang Anda berikan secara
            langsung kepada kami saat Anda membuat akun, melakukan pemesanan,
            atau menghubungi layanan pelanggan kami. Informasi ini dapat
            mencakup nama, alamat email, nomor telepon, alamat pengiriman, dan
            informasi pembayaran. Kami juga mengumpulkan file desain yang Anda
            unggah untuk keperluan produksi.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            2. Penggunaan Informasi
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Memproses dan memenuhi pesanan cetak Anda.</li>
              <li>
                Berkomunikasi dengan Anda mengenai pembaruan pesanan,
                pengiriman, dan layanan pelanggan.
              </li>
              <li>Meningkatkan kualitas layanan dan platform kami.</li>
              <li>
                Mengirimkan informasi promosi (Anda dapat berhenti berlangganan
                kapan saja).
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            3. Keamanan File Desain
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Kami sangat menjaga kerahasiaan kekayaan intelektual Anda. File
            desain yang Anda unggah murni digunakan untuk keperluan pencetakan
            pesanan Anda dan tidak akan dipublikasikan, dijual, atau dibagikan
            kepada pihak ketiga tanpa persetujuan tertulis dari Anda. File akan
            disimpan secara aman di server kami (Google Cloud/AWS) dan dapat
            dihapus sesuai permintaan.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            4. Pembagian Data
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Kami tidak menjual atau menyewakan informasi pribadi Anda kepada
            pihak ketiga. Kami hanya membagikan informasi dengan mitra pihak
            ketiga terpercaya (seperti vendor pembayaran dan layanan
            logistik/kurir) sebatas yang diperlukan untuk menyediakan layanan
            kepada Anda.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            5. Cookies
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Situs kami menggunakan "cookies" untuk meningkatkan pengalaman
            pengguna, mempertahankan sesi login, dan melacak analitik situs.
            Anda dapat mengatur browser Anda untuk menolak cookies, namun
            beberapa fitur situs mungkin tidak berfungsi sebagaimana mestinya.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-semibold text-2xl text-foreground">
            6. Hubungi Kami
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini,
            silakan hubungi kami di <strong>halo@antifocus.com</strong> atau
            melalui WhatsApp di nomor yang tertera pada situs kami.
          </p>
        </section>
      </div>
    </main>
  );
}
