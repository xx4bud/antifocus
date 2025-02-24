import { siteConfig } from "@/config/site";
import Link from "next/link";
import React from "react";

export default function Copyright() {
  return (
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
  );
}
