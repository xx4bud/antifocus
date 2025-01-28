export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Antifocus",
  slogan: "Vendor Merchandise Souvenir Custom",
  author: {
    name: "xx4bud",
    url: "https://github.com/xx4bud",
  },
  description: "Make your dream product come true",
  ogImage: process.env.NEXT_PUBLIC_BASE_URL + "/og.jpg",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  links: {
    whatsapp: "https://wa.me/6289602808726",
  },
};
