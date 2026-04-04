import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Link } from "@/lib/i18n/link";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/button";

interface FabsProps {
  className?: string;
}

export function Fabs({ className }: FabsProps) {
  return (
    <div
      className={cn(
        "fixed right-3 bottom-20 z-10 flex items-center justify-center",
        className
      )}
    >
      <Button asChild className="size-12" size={"icon"}>
        <Link
          aria-label="Chat on WhatsApp"
          href={"https://wa.me/6289602808726"}
          target="_blank"
        >
          <IconBrandWhatsapp className="size-7" />
        </Link>
      </Button>
    </div>
  );
}
