"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Fabs } from "@/components/footer/fabs";

export function AppFooter() {
  return (
    <>
      <Fabs className="sm:hidden" />
      <footer className="border-grid w-full border-t bg-secondary text-secondary-foreground">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between">
            <span className="py-1 text-xs">
              &copy;&nbsp;{new Date().getFullYear()}&nbsp;
              {siteConfig.name}&nbsp;by&nbsp;
              <Link
                href={siteConfig.author.url}
                className="hover:underline"
                target="_blank"
              >
                <span>{siteConfig.author.name}.</span>
              </Link>
              &nbsp;All&nbsp;rights&nbsp;reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
