"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { Prelink } from "@/components/ui/prelink";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter((seg) => seg);

  const formatSegment = (segment: string) => {
    if (segment.startsWith("[") && segment.endsWith("]")) {
      return segment
        .slice(1, -1)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const buildPath = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <div className="p-1 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Prelink prefetch={true} href="/">
                Home
              </Prelink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage className="max-w-24 truncate md:max-w-none">
                    {formatSegment(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="max-w-24 truncate md:max-w-none"
                    asChild
                  >
                    <Prelink
                      prefetch={true}
                      href={buildPath(index)}
                    >
                      {formatSegment(segment)}
                    </Prelink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
