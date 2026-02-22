"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ComponentProps } from "react";
import { Link } from "~/i18n/navigation";

const isExternalLink = (href: string | { pathname: string }) =>
  typeof href === "string" && href.startsWith("http");

const getHrefPathname = (href: string | { pathname: string }) =>
  typeof href === "string" ? href : href.pathname;

export type LinkProps = ComponentProps<typeof Link>;

export function NavLink({
  href,
  ...rest
}: Omit<LinkProps, "href"> & {
  href: LinkProps["href"] | `http${string}` | `https${string}`;
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  const hrefPathname = getHrefPathname(href);
  const isActive = pathname === hrefPathname;

  if (isExternalLink(href)) {
    return (
      <a
        href={href as string}
        rel="noopener noreferrer"
        target="_blank"
        {...rest}
      />
    );
  }

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      href={href as LinkProps["href"]}
      {...rest}
    />
  );
}

export type Href =
  | LinkProps["href"]
  | `http${string}`
  | `https${string}`
  | undefined;
