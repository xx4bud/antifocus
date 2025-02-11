import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export function LogoBar() {
  return (
    <Link
      prefetch={true}
      href={"/"}
      className="flex items-center hover:opacity-90"
    >
      <Image
        priority
        src={"/logo-white.svg"}
        alt={siteConfig.name + " logo"}
        width={152}
        height={36}
        quality={50}
        sizes="(max-width: 768px) 100vw, 152px"
      />
    </Link>
  );
}
