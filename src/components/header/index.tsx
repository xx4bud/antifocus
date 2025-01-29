import { LogoBar } from "@/components/ui/logobar";
import { SearchBar } from "@/components/ui/searchbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaRegUser, FaWhatsapp } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <>
      <header className="border-grid sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-primary/95">
        <div className="container-wrapper">
          <div className="container flex h-16 flex-1 shrink-0 items-center justify-between transition-[width,height] ease-linear">
            <div className="flex items-center justify-start space-x-4 md:min-w-[200px]">
              <LogoBar />
            </div>

            <div className="mx-4 hidden max-w-md flex-1 items-center md:flex">
              <SearchBar />
            </div>

            <div className="hidden items-center justify-end space-x-4 sm:flex md:min-w-[200px]">
              <Link href={"/signin"}>
                <Button variant={"bordered"}>
                  <FaRegUser />
                  SignIn
                </Button>
              </Link>

              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
              >
                <Button variant={"secondary"}>
                  <FaWhatsapp />
                  WhatsApp
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-end sm:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
