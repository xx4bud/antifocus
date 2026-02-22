import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { NavLink } from "~/components/ui/nav-link";
import { cn } from "~/utils/styles";

interface FabsProps {
  className?: string;
}

export function Fabs({ className }: FabsProps) {
  return (
    <div
      className={cn(
        "fixed right-3 bottom-20 z-50 flex items-center justify-center",
        className
      )}
    >
      <Button asChild className="size-12" size={"icon"}>
        <NavLink
          aria-label="Chat on WhatsApp"
          href={"https://wa.me/6289602808726"}
          target="_blank"
        >
          <IconBrandWhatsapp className="size-7" />
        </NavLink>
      </Button>
    </div>
  );
}
