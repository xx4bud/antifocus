import { Geist, Geist_Mono, Roboto_Serif } from "next/font/google";

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
