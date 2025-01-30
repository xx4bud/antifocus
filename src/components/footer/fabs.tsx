"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "../ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Fabs() {
  return (
    <nav className="fixed bottom-6 right-6 flex items-center justify-center sm:hidden">
      <Link
        href={siteConfig.links.whatsapp}
        target="_blank"
      >
        <Button
          size={"icon"}
          className="size-12 [&_svg]:size-7"
        >
          <FaWhatsapp />
        </Button>
      </Link>
    </nav>
  );
}
