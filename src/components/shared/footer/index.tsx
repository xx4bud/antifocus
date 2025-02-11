"use client";

import { siteConfig } from "@/config/site";
import { Fabs } from "./fabs";
import Link from "next/link";

export function AppFooter() {
  return (
    <>
      <Fabs className="sm:hidden" />
      <footer className="container-wrapper border-t bg-secondary text-secondary-foreground">
        <div className="container">
          <div className="flex items-center justify-between px-2">
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
