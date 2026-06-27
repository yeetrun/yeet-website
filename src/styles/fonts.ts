import { IBM_Plex_Mono, Space_Grotesk, Source_Sans_3 } from "next/font/google";

export const displayFont = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--display-font",
});

export const bodyFont = Source_Sans_3({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--body-font",
});

export const monoFont = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--mono-font",
});
