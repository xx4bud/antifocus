import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";
import { Link } from "@/lib/i18n/link";
import { Button } from "../ui/button";
import { LogoBlack } from "../ui/logo";

export function FooterMain() {
  const currentYear = new Date().getFullYear();

  const social = [
    {
      label: "WhatsApp",
      href: "https://wa.me/6289602808726",
      icon: IconBrandWhatsapp,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/antifocus.id",
      icon: IconBrandInstagram,
    },
  ];

  const categories = [
    { label: "Stiker & Label", href: "/categories/stiker" },
    { label: "Banner & Spanduk", href: "/categories/banner-spanduk" },
    { label: "Kartu Nama", href: "/categories/kartu-nama" },
    { label: "Brosur & Flyer", href: "/categories/brosur-flyer" },
    { label: "Semua Kategori", href: "/categories" },
  ];

  const help = [
    { label: "Syarat & Ketentuan", href: "/terms" },
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "FAQ", href: "/faq" },
    { label: "Cara Pemesanan", href: "/how-to-order" },
    { label: "Lacak Pesanan", href: "/track" },
  ];

  const contact = [
    {
      label: "Jl.Sirkuit Sentul, Kab. Bogor, Jawa Barat 16810",
      href: "https://maps.app.goo.gl/6289602808726",
      icon: IconMapPin,
    },
    {
      label: "+62 896-0280-8726",
      href: "https://wa.me/6289602808726",
      icon: IconBrandWhatsapp,
    },
    {
      label: "support@antifocus.my.id",
      href: "mailto:support@antifocus.my.id",
      icon: IconMail,
    },
  ];

  const termsAndPolicy = [
    { label: "Kebijakan Privasi", href: "/privacy" },
    { label: "Syarat & Ketentuan", href: "/terms" },
  ];

  return (
    <div className="flex flex-col gap-4 pt-6 pb-2 md:gap-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <LogoBlack href={"/"} />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Platform cetak digital terpercaya untuk semua kebutuhan bisnis dan
            personal Anda. Mudah, cepat, dan berkualitas.
          </p>
          <div className="flex items-center gap-3">
            {social.map((item) => (
              <Button key={item.label} size={"icon-lg"}>
                <Link href={item.href}>
                  <item.icon />
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground">Kategori Produk</h3>
            <ul className="flex flex-col gap-2 text-muted-foreground text-sm">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link
                    className="underline-offset-4 hover:text-primary"
                    href={category.href}
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground">Bantuan</h3>
            <ul className="flex flex-col gap-2 text-muted-foreground text-sm">
              {help.map((item) => (
                <li key={item.label}>
                  <Link
                    className="underline-offset-4 hover:text-primary"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="pl-0.5 font-semibold text-foreground">
              Hubungi Kami
            </h3>
            <ul className="flex flex-col gap-3 text-muted-foreground text-sm">
              {contact.map((item) => (
                <li className="flex items-start gap-3" key={item.label}>
                  <item.icon className="size-4 shrink-0 text-primary" />
                  <Link
                    className="-mt-1 text-left underline-offset-4 hover:text-primary"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-border border-t pt-4 text-muted-foreground text-xs md:flex-row">
        <p>
          &copy; {currentYear} Antifocus. Hak cipta dilindungi undang-undang.
        </p>
        <div className="flex gap-4">
          {termsAndPolicy.map((item) => (
            <Link
              className="underline-offset-4 hover:text-primary"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
