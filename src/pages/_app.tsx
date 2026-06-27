import "@/styles/globals.css";
import { bodyFont, displayFont, monoFont } from "@/styles/fonts";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${bodyFont.className} ${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <Component {...pageProps} />
    </div>
  );
}
