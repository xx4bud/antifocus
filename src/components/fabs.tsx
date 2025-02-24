"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

interface FabsProps {
  className?: string;
}

export function Fabs({ className }: FabsProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center",
        className
      )}
    >
      <Button
        size={"icon"}
        className="size-12 [&_svg]:size-7"
        asChild
      >
        <Link
          href={siteConfig.links.whatsapp}
          target="_blank"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp />
        </Link>
      </Button>
    </div>
  );
}
