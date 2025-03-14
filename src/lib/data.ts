import banner1 from "@assets/images/carousel-1.webp";
import banner2 from "@assets/images/carousel-2.webp";
import { FeaturedBanner } from "./types";

export const banners: FeaturedBanner[] = [
  {
    id: 1,
    src: banner1,
    alt: "Antifocus Banner 1",
  },
  {
    id: 2,
    src: banner2,
    alt: "Antifocus Banner 2",
  },
];

export const categoriesData = {
  id: 1,
  slug: "categories",
  src: "",
  name: "Categories",
}