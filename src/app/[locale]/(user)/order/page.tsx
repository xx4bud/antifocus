import type { Metadata } from "next";
import { createMetadata } from "~/utils/seo";

export default function Order() {
  return <div>Order</div>;
}

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Pesanan Saya",
  });
}
