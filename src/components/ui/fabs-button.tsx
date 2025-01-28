import { FaWhatsapp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FabsButton = () => {
  return (
    <div className="fixed bottom-5 right-7 flex sm:hidden">
      <Link
        href={"https://wa.me/6289602808726"}
        target="_blank"
      >
        <Button
          aria-label="WhatsApp Button"
          className="size-12 border border-border/30 shadow shadow-accent [&_svg]:size-8"
        >
          <FaWhatsapp aria-hidden="true" />
        </Button>
      </Link>
    </div>
  );
};
