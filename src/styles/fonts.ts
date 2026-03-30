import { Geist, Geist_Mono, Roboto_Serif } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const robotoSerif = Roboto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
});
