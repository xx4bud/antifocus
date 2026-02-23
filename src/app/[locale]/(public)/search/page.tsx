import type { Metadata } from "next";
import { createMetadata } from "~/utils/seo";

export default function Search() {
  return <div>Search</div>;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Cari",
  });
}
