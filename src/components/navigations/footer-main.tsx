import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import { Link } from "~/i18n/navigation";

export function FooterMain() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-12 pt-12 pb-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
        <div className="flex flex-col gap-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
              A
            </div>
            <span className="font-bold text-xl tracking-tight">Antifocus</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Platform cetak digital terpercaya untuk semua kebutuhan bisnis dan
            personal Anda. Mudah, cepat, dan berkualitas.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              className="rounded-full bg-accent p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              href="https://wa.me/6281234567890"
              rel="noreferrer"
              target="_blank"
            >
              <IconBrandWhatsapp className="size-4" />
            </a>
            <a
              className="rounded-full bg-accent p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              href="https://instagram.com/antifocus"
              rel="noreferrer"
              target="_blank"
            >
              <IconBrandInstagram className="size-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-foreground">Kategori Produk</h3>
          <ul className="flex flex-col gap-3 text-muted-foreground text-sm">
            <li>
              <Link className="hover:text-primary" href="/categories/stiker">
                Stiker & Label
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                href="/categories/banner-spanduk"
              >
                Banner & Spanduk
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                href="/categories/kartu-nama"
              >
                Kartu Nama
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary"
                href="/categories/brosur-flyer"
              >
                Brosur & Flyer
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/categories">
                Semua Kategori &rarr;
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-foreground">Bantuan</h3>
          <ul className="flex flex-col gap-3 text-muted-foreground text-sm">
            <li>
              <Link className="hover:text-primary" href="/faq">
                FAQ
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/how-to-order">
                Cara Pesan
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/track">
                Lacak Pesanan
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/terms">
                Syarat & Ketentuan
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-foreground">Hubungi Kami</h3>
          <ul className="flex flex-col gap-3 text-muted-foreground text-sm">
            <li className="flex items-start gap-3">
              <IconMapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Jl. Cetak Cepat No. 99, Jakarta Selatan, 12345</span>
            </li>
            <li className="flex items-center gap-3">
              <IconBrandWhatsapp className="size-4 shrink-0 text-primary" />
              <span>+62 812 3456 7890</span>
            </li>
            <li className="flex items-center gap-3">
              <IconMail className="size-4 shrink-0 text-primary" />
              <span>halo@antifocus.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 text-muted-foreground text-sm md:flex-row">
        <p>
          &copy; {currentYear} Antifocus. Hak cipta dilindungi undang-undang.
        </p>
        <div className="flex gap-4">
          <Link className="hover:text-primary" href="/privacy">
            Kebijakan Privasi
          </Link>
          <Link className="hover:text-primary" href="/terms">
            Ketentuan Layanan
          </Link>
        </div>
      </div>
    </div>
  );
}
