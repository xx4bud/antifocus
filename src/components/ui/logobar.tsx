import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export function LogoBar() {
  return (
    <Link
      href={"/"}
      className="flex items-center hover:opacity-90"
    >
      <Image
        priority
        src={"/logo-white.svg"}
        alt={siteConfig.name + " logo"}
        width={152}
        height={36}
      />
    </Link>
  );
}
