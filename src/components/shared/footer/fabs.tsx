"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface FabsProps {
  className?: string;
}

export function Fabs({ className }: FabsProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-6 right-6 flex items-center justify-center",
        className
      )}
    >
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
