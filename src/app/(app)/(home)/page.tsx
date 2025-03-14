import React from "react";
import { FeaturedBanners } from "./featured-banners";
import { banners } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col p-2">
      <FeaturedBanners banners={banners} />
    </div>
  );
}
