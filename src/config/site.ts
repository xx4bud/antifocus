export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Antifocus",
  author: {
    name: "xx4bud",
    url: "https://github.com/xx4bud",
  },
  description: "Vendor Merchandise Souvenir Custom",
  url:
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://antifocus.vercel.app",
  ogImage: process.env.NEXT_PUBLIC_BASE_URL + "/og.jpg",
  links: {
    whatsapp: "https://wa.me/6289602808726",
  },
};
